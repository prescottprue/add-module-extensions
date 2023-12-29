"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const path_1 = require("path");
const utils_1 = require("./utils");
const fs_1 = require("fs");
exports.parser = 'tsx';
const MyTransform = (fileInfo, { jscodeshift: j }) => {
    const currentModuleDirectoryPath = (0, path_1.dirname)((0, path_1.resolve)(fileInfo.path));
    const pkg = (0, utils_1.getPackageJson)();
    const root = j(fileInfo.source);
    const dependencies = [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.devDependencies),
    ];
    // Modify export all declarations
    root
        .find(j.ExportAllDeclaration)
        .filter((item) => {
        const exportPath = item.value.source?.value;
        return typeof exportPath === 'string' && !exportPath.endsWith('.js');
    })
        .replaceWith((item) => {
        const exportPath = item.value.source?.value;
        return j.exportAllDeclaration(j.literal(`${exportPath}.js`), item.value.exported);
    });
    // Modify import declarations
    root
        .find(j.ImportDeclaration)
        // Filter out the import statements which are dependencies
        .filter((item) => {
        item.value.loc?.source;
        const importPath = item.value.source?.value;
        return (typeof importPath === 'string' &&
            !importPath.startsWith('node:') && // Not node built in (with prefix)
            !utils_1.nodeBuildIns.includes(importPath) && // Not node built in (without prefix)
            !importPath.endsWith('.js') && // Not already a transformed path
            !dependencies.some((dep) => dep === importPath)); // Not a dep or dev dep
    })
        .replaceWith((item) => {
        const importPath = item.value.source.value;
        const importedFilePath = (0, path_1.resolve)(currentModuleDirectoryPath, importPath);
        const barrelFilePath = (0, path_1.resolve)(importedFilePath, 'index.ts');
        if (typeof importPath === 'string' &&
            !importPath.endsWith('/index') &&
            (0, fs_1.existsSync)(barrelFilePath)) {
            return j.importDeclaration(item.value.specifiers, j.literal(`${importPath}/index.js`));
        }
        return j.importDeclaration(item.value.specifiers, j.literal(`${importPath}.js`));
    });
    return root.toSource({ quote: 'single' });
};
exports.default = MyTransform;
//# sourceMappingURL=transformExtensions.js.map