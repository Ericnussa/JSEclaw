# JSEBot Icon Export Guide (Phase 1)

## Source
- `jsebot-icon.svg` (256x256 base)

## Exports Needed

### 1. Color Variants (Main Icon)
Export from jsebot-icon.svg at these resolutions:
- [ ] 256x256 → `jsebot-icon-256.png` (GitHub, npm small)
- [ ] 512x512 → `jsebot-icon-512.png` (npm package avatar, web medium)
- [ ] 1024x1024 → `jsebot-icon-1024.png` (web large, marketing)

### 2. macOS Menu Bar (Silhouette)
Create black silhouette variant, 16x16:
- [ ] 16x16 white on transparent → `jsebot-icon-menubar-white.png` (for dark mode)
- [ ] 16x16 black on transparent → `jsebot-icon-menubar-black.png` (for light mode)

Template for silhouette:
```svg
<!-- Remove gradients, convert all fills to solid black -->
<!-- Keep stroke: #ffffff (white) for menu bar visibility -->
```

### 3. Favicon
- [ ] 16x16 → favicon-16.png
- [ ] 32x32 → favicon-32.png
- [ ] 48x48 → favicon-48.png
- [ ] Combine into favicon.ico (or use as png favicon)

### 4. Apple Touch Icon
- [ ] 180x180 rounded (for iOS home screen) → apple-touch-icon-180.png

---

## Tools to Use

**Online (quickest):**
- https://convertio.co/svg-png/ (batch export)
- https://www.svgtoimg.com/ (supports multiple sizes)
- https://icoconvert.com/ (favicon generation)

**Local (if available):**
```bash
# Using Inkscape
inkscape jsebot-icon.svg --export-type=png --export-width=256 -o jsebot-icon-256.png

# Using ImageMagick
magick jsebot-icon.svg -resize 256x256 jsebot-icon-256.png
```

**Python (PIL):**
```bash
pip install pillow cairosvg
python3 -c "
from PIL import Image
import cairosvg
cairosvg.svg2png(url='jsebot-icon.svg', write_to='jsebot-icon-256.png', output_width=256)
"
```

---

## Export Checklist
- [ ] All color PNG variants created
- [ ] Silhouette variants created
- [ ] Favicon generated
- [ ] Apple touch icon created
- [ ] All files committed to `/assets/branding/`
- [ ] README updated with icon locations
- [ ] npm package.json references favicon

---

## Status: READY FOR EXPORT
The SVG is optimized and ready. Choose a tool above and export!
