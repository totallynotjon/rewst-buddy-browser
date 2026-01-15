import * as fs from 'node:fs';
import * as path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceIcon = path.resolve(projectRoot, 'rewst.png');
const iconsDir = path.resolve(projectRoot, 'media/icons');

const sizes = [16, 48, 128];

async function generateIcons() {
  // Ensure icons directory exists
  if (!fs.existsSync(iconsDir)) {
    await fs.promises.mkdir(iconsDir, { recursive: true });
  }

  console.log('Generating icons...');

  for (const size of sizes) {
    const outputPath = path.resolve(iconsDir, `icon-${size}.png`);

    await sharp(sourceIcon)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`Created ${size}x${size} icon: ${path.relative(projectRoot, outputPath)}`);
  }

  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
