# Deployment Guide

Production deployment guides for JSEBot across multiple platforms: Docker, Kubernetes, systemd, launchd, and bare metal.

## Table of Contents

- [Docker](#docker)
- [Kubernetes](#kubernetes)
- [systemd (Linux)](#systemd-linux)
- [launchd (macOS)](#launchd-macos)
- [Bare Metal](#bare-metal)
- [Raspberry Pi 5](#raspberry-pi-5)
- [M5Stack CoreS3](#m5stack-coresia)
- [Scaling & Monitoring](#scaling--monitoring)

---

## Docker

### Quick Start

```bash
# Build the image
docker build -t jsebot:latest .

# Run the container
docker run -d \
  --name jsebot \
  -v ~/.jsebot:/root/.jsebot \
  -p 18789:18789 \
  -e NODE_ENV=production \
  jsebot:latest

# View logs
docker logs -f jsebot

# Stop container
docker stop jsebot
```

### docker-compose

```yaml
version: "3.8"

services:
  jsebot:
    image: jsebot:latest
    container_name: jsebot
    restart: always

    ports:
      - "18789:18789"

    volumes:
      - ~/.jsebot:/root/.jsebot
      - jsebot-cache:/root/.cache

    environment:
      NODE_ENV: production
      LOG_LEVEL: info
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}

    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:18789/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    networks:
      - jsebot-network

volumes:
  jsebot-cache:

networks:
  jsebot-network:
    driver: bridge
```

**Run with Compose:**

```bash
docker-compose up -d

# View logs
docker-compose logs -f jsebot

# Stop
docker-compose down
```

### Production Image

```dockerfile
# Multi-stage build for smaller image
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Runtime stage
FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

RUN useradd -m -u 1000 jsebot && chown -R jsebot:jsebot /app
USER jsebot

EXPOSE 18789

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:18789/health || exit 1

CMD ["node", "dist/cli.js", "gateway", "--port", "18789"]
```

### Docker Security

```bash
# Run as non-root
docker run --user 1000:1000 jsebot:latest

# Read-only filesystem
docker run --read-only \
  --tmpfs /tmp \
  --tmpfs /root/.jsebot \
  jsebot:latest

# Resource limits
docker run \
  --memory 2g \
  --cpus 2 \
  jsebot:latest

# Network isolation
docker network create jsebot-net
docker run --network jsebot-net jsebot:latest
```

---

## Kubernetes

### Deployment

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: jsebot-config
  namespace: jsebot
data:
  config.yaml: |
    gateway:
      port: 18789
      host: 0.0.0.0
    models:
      default: claude-opus-4-1
    channels:
      discord:
        dmPolicy: pairing
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jsebot
  namespace: jsebot
spec:
  replicas: 1 # Gateway must be single instance
  selector:
    matchLabels:
      app: jsebot
  template:
    metadata:
      labels:
        app: jsebot
    spec:
      containers:
        - name: jsebot
          image: jsebot:latest
          imagePullPolicy: IfNotPresent

          ports:
            - containerPort: 18789
              name: gateway

          env:
            - name: NODE_ENV
              value: production
            - name: ANTHROPIC_API_KEY
              valueFrom:
                secretKeyRef:
                  name: jsebot-secrets
                  key: anthropic-api-key
            - name: OPENAI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: jsebot-secrets
                  key: openai-api-key

          volumeMounts:
            - name: config
              mountPath: /root/.jsebot
            - name: cache
              mountPath: /root/.cache

          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "2Gi"
              cpu: "1000m"

          livenessProbe:
            httpGet:
              path: /health
              port: 18789
            initialDelaySeconds: 40
            periodSeconds: 30
            timeoutSeconds: 10

          readinessProbe:
            httpGet:
              path: /health
              port: 18789
            initialDelaySeconds: 10
            periodSeconds: 10

      volumes:
        - name: config
          configMap:
            name: jsebot-config
        - name: cache
          emptyDir: {}
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: jsebot
  namespace: jsebot
spec:
  type: ClusterIP
  ports:
    - port: 18789
      targetPort: 18789
      protocol: TCP
  selector:
    app: jsebot
```

### Deploy

```bash
# Create namespace
kubectl create namespace jsebot

# Create secrets
kubectl create secret generic jsebot-secrets \
  --from-literal=anthropic-api-key=$ANTHROPIC_API_KEY \
  --from-literal=openai-api-key=$OPENAI_API_KEY \
  -n jsebot

# Apply manifests
kubectl apply -f deployment.yaml

# Check status
kubectl get pods -n jsebot
kubectl logs -f deployment/jsebot -n jsebot

# Forward port for testing
kubectl port-forward svc/jsebot 18789:18789 -n jsebot
```

---

## systemd (Linux)

### Service File

Create `/etc/systemd/user/jsebot.service`:

```ini
[Unit]
Description=JSEBot Gateway
Documentation=https://docs.jsebot.dev
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=jsebot
Group=jsebot
WorkingDirectory=%h/.jsebot

Environment="NODE_ENV=production"
Environment="ANTHROPIC_API_KEY=sk-..."
Environment="OPENAI_API_KEY=sk-..."

ExecStart=/usr/bin/jsebot gateway --port 18789

Restart=always
RestartSec=10

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=false  # Need access to ~/.jsebot

# Resource limits
MemoryLimit=2G
CPUQuota=100%

StandardOutput=journal
StandardError=journal
SyslogIdentifier=jsebot

[Install]
WantedBy=default.target
```

### Enable & Start

```bash
# For current user
systemctl --user daemon-reload
systemctl --user enable jsebot
systemctl --user start jsebot

# View status
systemctl --user status jsebot

# View logs
journalctl --user -u jsebot -f

# Stop
systemctl --user stop jsebot

# For system-wide (requires sudo)
sudo systemctl enable jsebot
sudo systemctl start jsebot
sudo journalctl -u jsebot -f
```

### Automatic Restart

The service will automatically restart JSEBot if it crashes. Check status:

```bash
systemctl --user status jsebot
# Should show: `Active: active (running)` and `Restart Count: X`
```

---

## launchd (macOS)

### Plist File

Create `~/Library/LaunchAgents/com.jsebot.gateway.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.jsebot.gateway</string>

  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/jsebot</string>
    <string>gateway</string>
    <string>--port</string>
    <string>18789</string>
  </array>

  <key>EnvironmentVariables</key>
  <dict>
    <key>NODE_ENV</key>
    <string>production</string>
    <key>ANTHROPIC_API_KEY</key>
    <string>sk-...</string>
    <key>OPENAI_API_KEY</key>
    <string>sk-...</string>
  </dict>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>/var/log/jsebot/stdout.log</string>

  <key>StandardErrorPath</key>
  <string>/var/log/jsebot/stderr.log</string>

  <key>WorkingDirectory</key>
  <string>~/.jsebot</string>
</dict>
</plist>
```

### Install & Start

```bash
# Load the service
launchctl load ~/Library/LaunchAgents/com.jsebot.gateway.plist

# Check status
launchctl list | grep jsebot

# View logs
tail -f /var/log/jsebot/stdout.log

# Stop
launchctl unload ~/Library/LaunchAgents/com.jsebot.gateway.plist

# Restart
launchctl restart com.jsebot.gateway
```

---

## Bare Metal

### Direct Installation

```bash
# Install Node.js 22+
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install JSEBot
sudo npm install -g jsebot

# Verify
jsebot --version

# Run gateway
jsebot gateway --port 18789 --daemonize

# Or with tmux/screen
screen -dmS jsebot jsebot gateway --port 18789 --verbose

# Later, reattach:
screen -r jsebot
```

### System User (Recommended)

```bash
# Create dedicated user
sudo useradd -r -s /bin/bash -m -d /var/lib/jsebot jsebot

# Configure permissions
sudo mkdir -p /var/lib/jsebot/.jsebot
sudo chown -R jsebot:jsebot /var/lib/jsebot

# Install as jsebot user
sudo -u jsebot npm install -g jsebot

# Create systemd service (see section above)
```

---

## Raspberry Pi 5

### Hardware Setup

**Bill of Materials:**

- Raspberry Pi 5 (8GB recommended)
- NVMe SSD (256GB+, 25mm form factor)
- M.2 to USB adapter (temporary)
- USB-C power supply (27W+ recommended)
- 8" or 10.1" touchscreen (optional)

### OS Installation

```bash
# Download Raspberry Pi OS (64-bit Lite)
# https://www.raspberrypi.com/software/

# Write to SD card using Balena Etcher or:
sudo dd if=raspios.img of=/dev/rdiskX bs=4m

# Boot and login (default: pi/raspberry)

# Update system
sudo apt update && sudo apt upgrade -y

# Install NVMe SSD (if applicable)
# 1. Write OS to NVMe using adapter
# 2. Boot from NVMe (enable in raspi-config)
```

### JSEBot Installation

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Install dependencies
sudo apt install -y \
  build-essential \
  git \
  python3-dev \
  libffi-dev

# Install JSEBot
npm install -g jsebot

# Create workspace
jsebot onboard

# Run as service
jsebot gateway --install-daemon
systemctl --user status jsebot
```

### Performance Tuning

```bash
# Disable unnecessary services
sudo systemctl disable bluetooth.service
sudo systemctl disable avahi-daemon.service

# Overclock (optional, with cooling)
# Edit /boot/config.txt:
# [over_clocking]
# arm_freq=2400
# gpu_freq=800

# Disable screen blanking (for touchscreen)
# Edit /boot/cmdline.txt:
# Add: consoleblank=0

# Increase swap (optional)
sudo dphys-swapfile swapoff
# Edit /etc/dphys-swapfile: CONF_SWAPSIZE=4096
sudo dphys-swapfile swapon
```

### Hardware Rendering (Handheld Display)

```bash
# Install graphics libraries
sudo apt install -y \
  libgl1-mesa-dri \
  libgles2-mesa \
  libxcb-render0 \
  libxcb-shape0

# For touchscreen (if using 5.5" display):
sudo apt install -y libts-dev

# Enable hardware acceleration
echo "dtoverlay=vc4-fkms-v3d" | sudo tee -a /boot/config.txt
```

---

## M5Stack CoreS3

### Hardware Setup

**Bill of Materials:**

- M5Stack CoreS3 (one module)
- USB-C cable (data + power)
- Wi-Fi network

### Firmware Installation

```bash
# Download M5Burner
# https://m5stack.com/download

# Flash firmware to CoreS3:
# 1. Open M5Burner
# 2. Select CoreS3
# 3. Choose "JSEBot Dashboard" firmware
# 4. Select COM port
# 5. Click "Burn"

# Or via Arduino IDE:
# 1. Install M5Stack libraries
# 2. Select Board: M5Stack-CoreS3
# 3. Upload sketch
```

### Remote Control

```bash
# Connect CoreS3 to Wi-Fi
# (Use onboard display to select network)

# From main JSEBot host:
jsebot coresia connect <CORESIA_IP>

# Now CoreS3 displays status:
# - Time + date
# - Rubi avatar (animated)
# - Weather
# - Notifications
# - System stats

# View dashboard
open http://CORESIA_IP:8080
```

---

## Scaling & Monitoring

### Multi-Agent Setup

Deploy multiple JSEBot instances with different specializations:

```yaml
# Load balancer config
upstream jsebot {
  server localhost:18789;  # Main agent
  server localhost:18790;  # Dev agent
  server localhost:18791;  # Ops agent
}

server {
  listen 80;
  location / {
    proxy_pass http://jsebot;
  }
}
```

### Monitoring

```bash
# Health check
jsebot doctor

# Metrics endpoint
curl http://localhost:18789/metrics

# Log aggregation
journalctl -u jsebot -f | grep ERROR

# Performance profiling
jsebot gateway --profile --port 18789
```

### Backup & Restore

```bash
# Backup configuration
tar -czf jsebot-backup.tar.gz ~/.jsebot/

# Restore
tar -xzf jsebot-backup.tar.gz -C ~/

# Cloud backup
aws s3 cp jsebot-backup.tar.gz s3://my-bucket/
```

---

## Troubleshooting

### "Port already in use"

```bash
# Find process using port 18789
lsof -i :18789

# Use different port
jsebot gateway --port 18790
```

### "Out of memory"

```bash
# Check memory usage
free -h

# Increase swap (Linux)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Reduce Node.js heap
NODE_OPTIONS="--max-old-space-size=512" jsebot gateway
```

### "Connection refused"

```bash
# Ensure gateway is running
jsebot gateway --status

# Check firewall
sudo ufw allow 18789

# Test locally
curl http://localhost:18789/health
```

---

## Support

- **Docs:** [Installation](GETTING-STARTED.md)
- **Issues:** [GitHub Issues](https://github.com/Ericnussa/JSEclaw/issues)
- **Discord:** [Join our server](https://discord.gg/jsebot)
