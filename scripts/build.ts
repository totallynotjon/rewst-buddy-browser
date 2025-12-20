import * as fs from 'node:fs';
import * as path from 'node:path';
import * as esbuild from 'esbuild';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Parse command line arguments
const target = process.argv[2] || 'firefox'; // 'chrome' or 'firefox'
const watch = process.argv[3] === 'watch';

const buildDirectory = path.resolve(projectRoot, `build-${target}`);

// Clean and create build directory
if (fs.existsSync(buildDirectory)) {
  await fs.promises.rm(buildDirectory, { recursive: true });
}
await fs.promises.mkdir(buildDirectory, { recursive: true });
await fs.promises.mkdir(path.resolve(buildDirectory, 'popup'), { recursive: true });

console.log(`Building for ${target}...`);

// Copy and process files
const filesToCopy = [
  {
    from: async () => {
      const manifestSrc = target === 'firefox' ? 'manifest-firefox.json' : 'manifest-chrome.json';
      const manifestPath = path.resolve(projectRoot, manifestSrc);
      return await fs.promises.readFile(manifestPath, 'utf-8');
    },
    to: path.resolve(buildDirectory, 'manifest.json'),
  },
  {
    from: path.resolve(projectRoot, 'src/popup/index.html'),
    to: path.resolve(buildDirectory, 'popup/index.html'),
  },
  {
    from: path.resolve(projectRoot, 'media/icons'),
    to: path.resolve(buildDirectory, 'icons'),
  },
];

for (const { from, to } of filesToCopy) {
  if (typeof from === 'function') {
    await fs.promises.writeFile(to, await from());
  } else {
    const stats = await fs.promises.stat(from);
    if (stats.isDirectory()) {
      await fs.promises.cp(from, to, { recursive: true });
    } else {
      await fs.promises.copyFile(from, to);
    }
  }
  console.log(`Created ${path.relative(projectRoot, to)}`);
}

// esbuild configuration
const buildOptions: esbuild.BuildOptions = {
  entryPoints: [
    path.resolve(projectRoot, 'src/background.ts'),
    path.resolve(projectRoot, 'src/popup/index.ts'),
  ],
  bundle: true,
  format: 'esm',
  outdir: buildDirectory,
  outExtension: { '.js': '.js' },
  entryNames: '[dir]/[name]',
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log(`Watching for changes...`);
} else {
  await esbuild.build(buildOptions);
  console.log(`Build complete!`);
}
