# og-image.jpg Creation Guide

This guide explains how to create the Open Graph social preview image for JSEBot.

## Specifications

- **Filename:** `og-image.jpg`
- **Dimensions:** 1200×630 pixels (required for OG + Twitter Card)
- **File Size:** <100KB (optimized)
- **Color Space:** RGB
- **Format:** JPEG, quality 85-90

## Design Specification

### Layout (1200×630)

```
┌─────────────────────────────────────────────┐
│  Left (0-300px)      Center (300-900px)  Right (900-1200px) │
│                                                              │
│  [JSEBot Logo]   [Rubi Avatar]  [Tagline + Features]       │
│  (256×256)       (Centered)    (Text overlay)               │
│                  (400×400)                                  │
│                                                              │
│  Dark gradient background with cyan accents                 │
│  Bottom: "JSEBot — Personal AI Assistant"                   │
└─────────────────────────────────────────────┘
```

### Colors

- **Primary Background:** Dark navy `#0a0e27`
- **Accent Color:** Cyan neon `#00d9ff`
- **Secondary:** Light blue `#38bdf8`
- **Text:** White `#ffffff`
- **Gradient:** `#0a0e27 → #1a1f3a`

### Elements

1. **JSEBot Logo** (top-left)
   - Source: `assets/branding/jsebot-icon.svg`
   - Size: 256×256 pixels
   - Position: x=20, y=20
   - No background needed (transparent)

2. **Rubi Avatar** (center)
   - Source: `assets/avatar-placeholder.svg` or Phase 3 sprite
   - Size: 400×400 pixels
   - Position: Centered horizontally, vertically centered
   - State: Idle or thinking (friendly pose)

3. **Tagline** (top-right area)
   - Text: "Personal AI Assistant"
   - Font: Bold, sans-serif (Helvetica, Arial, or similar)
   - Size: 48px
   - Color: White `#ffffff`
   - Position: x=700, y=100

4. **Features Text** (bottom-right)
   - Bullet points (2-3 features):
     • Multi-channel (20+ platforms)
     • Always-on & private
     • Powered by Claude
   - Font: Regular, 24px
   - Color: Cyan `#00d9ff`
   - Position: x=700, y=250

5. **Bottom Banner** (bottom edge)
   - Text: "github.com/Ericnussa/JSEclaw"
   - Font: Monospace, 18px
   - Color: Light blue `#38bdf8`
   - Height: 60px
   - Background: Darker strip `#05070f`

### Background

- **Main:** Dark navy gradient
  - Top: `#0a0e27`
  - Bottom: `#1a1f3a`
  - Angle: 135° (diagonal)

- **Accent Elements:**
  - Subtle grid or neon lines
  - Glow effect around Rubi avatar (optional)
  - Subtle animation paths (if saved as PNG sequence for GIF)

## Creation Tools

### Option 1: Figma (Recommended)

1. Create new file (1200×630)
2. Set artboard dimensions
3. Create dark background with gradient
4. Import logos and avatar from SVG
5. Add text layers
6. Export as JPEG quality 85%

**Figma Resources:**
- [Free Figma account](https://figma.com)
- SVG logos in `assets/branding/`
- Neon design tutorial: [Neon effects in Figma](https://www.figma.com)

### Option 2: Adobe Illustrator

1. File → New → 1200×630 px
2. Create background shape with gradient
3. Place SVG files as assets
4. Add text layers
5. File → Export As → JPEG

**Settings:**
- Quality: 85
- Color Model: RGB
- Profile: sRGB

### Option 3: Photoshop

1. New → 1200×630 px (72 dpi)
2. Create base layer with gradient
3. Import SVG/PNG assets
4. Add text with white/cyan colors
5. File → Export As → JPEG

**Settings:**
- Quality: 8-9 (out of 12)
- Baseline JPEG
- sRGB color space

### Option 4: Online Tool (Free)

1. **Canva** (https://canva.com)
   - Search: "Open Graph image"
   - Template: 1200×630
   - Customize with JSEBot branding
   - Export as JPEG

2. **Figma Community** (free templates)
   - Search: "OG image 1200x630"
   - Duplicate and customize
   - Export

3. **Pixlr** (https://pixlr.com)
   - Free online editor
   - Create 1200×630 design
   - Export as JPEG

### Option 5: Command Line (CLI)

Use **ImageMagick** or **GraphicsMagick**:

```bash
# Create with ImageMagick
convert -size 1200x630 \
  -background '#0a0e27' \
  -fill '#ffffff' \
  -gravity center \
  caption:'JSEBot\nPersonal AI Assistant' \
  og-image.jpg

# Or with more styling
convert -size 1200x630 \
  gradient:'#0a0e27-#1a1f3a' \
  -fill '#ffffff' \
  -pointsize 48 \
  -gravity NorthEast \
  -annotate +50+50 'Personal AI Assistant' \
  -fill '#00d9ff' \
  -pointsize 24 \
  -gravity SouthEast \
  -annotate +50+50 'github.com/Ericnussa/JSEclaw' \
  og-image.jpg
```

## Testing

After creating `og-image.jpg`:

### 1. File Validation

```bash
# Check dimensions
identify assets/og-image.jpg
# Output should show: 1200x630 JPEG

# Check file size
ls -lh assets/og-image.jpg
# Should be <100KB

# Verify RGB color space
identify -verbose assets/og-image.jpg | grep Colorspace
# Output: sRGB
```

### 2. Social Media Preview

- **Facebook:** https://developers.facebook.com/tools/debug/sharing/
  - Paste: https://github.com/Ericnussa/JSEclaw
  - Should show image preview with title + description

- **Twitter:** https://cards-dev.twitter.com/validator
  - Paste: https://github.com/Ericnussa/JSEclaw
  - Should show "summary_large_image" card with your image

- **LinkedIn:** https://www.linkedin.com/post-inspector/
  - Paste: https://github.com/Ericnussa/JSEclaw
  - Should preview correctly

### 3. GitHub Rendering

```bash
git add assets/og-image.jpg
git commit -m "assets: add OG image for social preview (1200x630)"
git push

# Then test:
# 1. Go to GitHub repo README
# 2. Click "Share" and copy link
# 3. Paste in Discord/Slack/Twitter
# 4. Preview should show your og-image.jpg
```

## Optimization

After creating the image, optimize for web:

```bash
# Using jpegoptim (macOS: brew install jpegoptim)
jpegoptim --max=85 assets/og-image.jpg

# Or using ImageMagick
convert assets/og-image.jpg \
  -quality 85 \
  -strip \
  -interlace Plane \
  assets/og-image-optimized.jpg

mv assets/og-image-optimized.jpg assets/og-image.jpg

# Verify size
ls -lh assets/og-image.jpg
# Should be 50-100KB
```

## Git Commit

```bash
git add assets/og-image.jpg
git commit -m "assets: add OG image for social preview (1200x630, 85KB)"
git push origin feat/phase-4-docs
```

## Next Steps

1. ✅ Create og-image.jpg following this guide
2. ✅ Optimize file size (<100KB)
3. ✅ Test in Facebook Debugger and Twitter Card Validator
4. ✅ Commit and push
5. ✅ Verify GitHub social preview works
6. ✅ Share link in Discord to confirm preview renders

---

## Troubleshooting

**"Image doesn't preview on social media"**
- Check: Is image exactly 1200×630?
- Check: Is file size <100KB?
- Check: Is filename exactly `assets/og-image.jpg`?
- Try: Wait 24 hours for cache to clear
- Try: Use Facebook Debugger to "Scrape Again"

**"Image appears blurry on mobile"**
- Image is correct; social apps downscale
- Ensure text is large (48px+) and high contrast
- Use solid colors where possible (gradients sometimes compress poorly)

**"Export format wrong"**
- JPEG only (not PNG or GIF)
- sRGB color space (not CMYK)
- 1200×630 exactly (not close)
- Quality 85-90 (not 100% or 72%)

---

## Resources

- **Open Graph Docs:** https://ogp.me/
- **Twitter Card Docs:** https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
- **Social Media Image Sizes:** https://buffer.com/resources/social-media-image-sizes/
- **Figma Design Tips:** https://www.figma.com/resource-library
- **ImageMagick Tutorials:** https://imagemagick.org/Usage/

---

**Save as:** `/home/eric/.openclaw/rubi/JSEclaw/assets/og-image.jpg`  
**Size:** 1200×630 pixels  
**Format:** JPEG, quality 85%  
**Max Size:** 100KB
