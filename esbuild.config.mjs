import esbuild from 'esbuild';

const isProd = process.env.NODE_ENV === 'production';

const config = {
  entryPoints: ['main.ts'],
  bundle: true,
  external: [
    'obsidian',
    'electron',
    '@codemirror/*',
    '@lezer/*'
  ],
  format: 'cjs',
  sourcemap: isProd ? false : 'inline',
  treeShaking: true,
  outfile: 'main.js',
  logLevel: 'info',
  minify: isProd,
  target: 'es2016',
  loader: {
    '.ts': 'ts'
  }
};

esbuild.build(config).catch(() => process.exit(1));