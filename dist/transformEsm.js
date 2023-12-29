"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const utils_1 = require("./utils");
exports.parser = 'tsx';
const nodeBuildIns = ['assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'querystring', 'readline', 'stream', 'string_decoder', 'timers', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];
const MyTransform = (fileInfo, { jscodeshift: j }, options) => {
    const pkg = (0, utils_1.getPackageJson)();
    const dependencies = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)];
    return j(fileInfo.source)
        .find(j.ImportDeclaration)
        // Filter out the import statements which are dependencies
        .filter((item) => {
        const importPath = item.value.source?.value;
        console.log('import path', importPath);
        item.value.source.
            console.log('is a dep', dependencies.some((dep) => dep === importPath));
        return typeof importPath === 'string' && !importPath.startsWith('node:') && // Not node built in (with prefix)
            !nodeBuildIns.includes(importPath) && // Not node built in (without prefix)
            !importPath.endsWith('.js') && // Not already a transformed path
            !dependencies.some((dep) => dep === importPath); // Not a dep or dev dep
    })
        .replaceWith((item) => {
        const importPath = item.value.source.value;
        return j.importDeclaration(item.value.specifiers, j.literal(`${importPath}.js`));
    })
        .toSource({ quote: 'single' });
};
exports.default = MyTransform;
//# sourceMappingURL=transformEsm.js.map