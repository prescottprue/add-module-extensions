"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeBuildIns = exports.getPackageJson = void 0;
const fs_1 = require("fs");
function getPackageJson() {
    const pkg = (0, fs_1.readFileSync)(`${process.cwd()}/package.json`);
    return JSON.parse(pkg.toString());
}
exports.getPackageJson = getPackageJson;
exports.nodeBuildIns = [
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
//# sourceMappingURL=utils.js.map