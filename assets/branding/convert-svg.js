import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const svgFile = args[0] || 'jsebot-icon.svg';
const svgPath = path.join(__dirname, svgFile);

const sizes = [256, 512, 1024, 16, 32, 48, 180];

if (!fs.existsSync(svgPath)) {
  console.error(`❌ SVG not found: ${svgPath}`);
  process.exit(1);
}

const svgContent = fs.readFileSync(svgPath, 'utf8');

(async () => {
  console.log('🎨 JSEBot SVG to PNG Converter');
  console.log('=============================');
  console.log(`Source: ${path.basename(svgPath)}`);
  console.log(`Sizes: ${sizes.join(', ')}`);
  console.log('');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let successCount = 0;

  for (const size of sizes) {
    try {
      const page = await browser.newPage();
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 0; background: transparent; }
            svg { display: block; width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          ${svgContent}
        </body>
        </html>
      `, { waitUntil: 'networkidle0' });

      await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });

      const basename = path.basename(svgPath, path.extname(svgPath));
      let outputName = `${basename}-${size}.png`;

      // Special naming for specific sizes
      if (size === 16 && svgFile === 'jsebot-icon.svg') outputName = 'jsebot-icon-menubar.png';
      if (size === 16 && svgFile.includes('silhouette')) outputName = 'jsebot-icon-menubar.png';
      if (svgFile.includes('silhouette') && size === 16) outputName = 'jsebot-icon-menubar.png';

      const outputPath = path.join(__dirname, outputName);

      await page.screenshot({
        path: outputPath,
        omitBackground: true,
      });

      console.log(`✅ ${outputName} (${size}x${size})`);
      successCount++;
      await page.close();
    } catch (e) {
      console.log(`⚠️  ${size}x${size} failed: ${e.message}`);
    }
  }

  await browser.close();

  console.log('');
  console.log(`✨ Export complete! (${successCount}/${sizes.length} succeeded)`);
  console.log('');
  console.log('📁 Files created:');
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.png'));
  files.forEach(f => {
    const stat = fs.statSync(path.join(__dirname, f));
    console.log(`   ${f} (${(stat.size / 1024).toFixed(1)}KB)`);
  });
})().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
