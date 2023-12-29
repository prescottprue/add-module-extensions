import { readFileSync } from 'fs';

export function getPackageJson() {
  const pkg = readFileSync(`${process.cwd()}/package.json`);
  return JSON.parse(pkg.toString());
}

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
