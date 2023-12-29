import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs';

export const nodeBuildIns = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'https',
  'net',
  'os',
  'path',
  'querystring',
  'readline',
  'stream',
  'string_decoder',
  'timers',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
];

export function getPackageJson() {
  const pkg = readFileSync(`${process.cwd()}/package.json`);
  return JSON.parse(pkg.toString());
}


export function shouldAppendIndex(currentModuleDirectoryPath: string, importPath: string) {
  const importedFilePath = resolve(
    currentModuleDirectoryPath,
    importPath,
  );
  const barrelFilePath = resolve(importedFilePath, 'index.ts');
  return typeof importPath === 'string' &&
    !importPath.endsWith('/index') &&
    existsSync(barrelFilePath)
}

