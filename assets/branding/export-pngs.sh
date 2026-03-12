#!/bin/bash
# JSEBot Icon Export Script
# Exports SVG icons to PNG at multiple sizes
# 
# Requirements: ImageMagick (convert/magick) or Inkscape
# Install: brew install imagemagick  (macOS)
#          apt install imagemagick    (Linux)
#          choco install imagemagick  (Windows)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SVG_COLOR="$SCRIPT_DIR/jsebot-icon.svg"
SVG_SILHOUETTE="$SCRIPT_DIR/jsebot-icon-silhouette.svg"

echo "🎨 JSEBot Icon Export"
echo "===================="
echo "Source: $SCRIPT_DIR"
echo ""

# Check for ImageMagick
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found!"
    echo "Install with:"
    echo "  macOS: brew install imagemagick"
    echo "  Linux: apt install imagemagick"
    echo "  Windows: choco install imagemagick"
    exit 1
fi

# Use 'magick' if available (newer), fall back to 'convert'
CONVERT_CMD="magick"
if ! command -v magick &> /dev/null; then
    CONVERT_CMD="convert"
fi

echo "📦 Using: $CONVERT_CMD"
echo ""

# Export color variants
echo "🌈 Exporting color variants..."
for SIZE in 256 512 1024; do
    OUTPUT="$SCRIPT_DIR/jsebot-icon-$SIZE.png"
    $CONVERT_CMD "$SVG_COLOR" -background none -resize "${SIZE}x${SIZE}" "$OUTPUT"
    echo "   ✅ jsebot-icon-$SIZE.png"
done

echo ""
echo "🖤 Exporting silhouette variants..."

# Menu bar icons (16x16)
$CONVERT_CMD "$SVG_SILHOUETTE" -background none -resize "16x16" "$SCRIPT_DIR/jsebot-icon-menubar.png"
echo "   ✅ jsebot-icon-menubar.png (16x16)"

# Favicon sizes
echo ""
echo "🔖 Exporting favicon variants..."
for SIZE in 16 32 48; do
    OUTPUT="$SCRIPT_DIR/favicon-$SIZE.png"
    $CONVERT_CMD "$SVG_COLOR" -background none -resize "${SIZE}x${SIZE}" "$OUTPUT"
    echo "   ✅ favicon-$SIZE.png"
done

# Try to create favicon.ico if ImageMagick supports it
if $CONVERT_CMD "$SCRIPT_DIR/favicon-16.png" "$SCRIPT_DIR/favicon-32.png" "$SCRIPT_DIR/favicon-48.png" "$SCRIPT_DIR/favicon.ico" 2>/dev/null; then
    echo "   ✅ favicon.ico (combined)"
else
    echo "   ⚠️  favicon.ico skipped (requires full ImageMagick ICO support)"
    echo "      Use online tool: https://icoconvert.com/"
fi

echo ""
echo "🍎 Exporting Apple touch icon..."
$CONVERT_CMD "$SVG_COLOR" -background white -resize "180x180" \
    -gravity center -extent 180x180 \
    -quality 95 \
    "$SCRIPT_DIR/apple-touch-icon-180.png"
echo "   ✅ apple-touch-icon-180.png"

echo ""
echo "✨ Export complete!"
echo ""
echo "📁 Files created:"
ls -lh "$SCRIPT_DIR"/jsebot-icon-*.png "$SCRIPT_DIR"/favicon-*.png "$SCRIPT_DIR"/apple-touch-icon-*.png 2>/dev/null || echo "   (Check folder for exports)"

echo ""
echo "📋 Next steps:"
echo "   1. Review exported PNG files"
echo "   2. Commit to git: git add assets/branding/*.png"
echo "   3. Update JSEBot README with icon locations"
echo "   4. Update npm package.json to reference favicon"
