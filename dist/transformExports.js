"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const utils_1 = require("./utils");
exports.parser = 'tsx';
const TransformExports = (fileInfo, { jscodeshift: j }, options) => {
    const pkg = (0, utils_1.getPackageJson)();
    return j(fileInfo.source)
        .find(j.ExportAllDeclaration)
        .filter((item) => {
        const exportPath = item.value.source?.value;
        console.log('export path', exportPath);
        console.log('export path', item.value);
        return typeof exportPath === 'string' && !exportPath.endsWith('.js');
    })
        .replaceWith((item) => {
        const importPath = item.value.source?.value;
        return j.exportAllDeclaration(j.literal(`${importPath}.js`), item.value.exported);
    })
        .toSource({ quote: 'single' });
};
exports.default = TransformExports;
//# sourceMappingURL=transformExports.js.map