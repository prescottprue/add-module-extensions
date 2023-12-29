import { resolve, dirname } from 'path';
import { Transform } from 'jscodeshift';
import { getPackageJson, nodeBuildIns } from './utils';
import { existsSync } from 'fs';

export const parser = 'tsx';

const MyTransform: Transform = (fileInfo, { jscodeshift: j }) => {
  const currentModuleDirectoryPath = dirname(resolve(fileInfo.path));
  const pkg = getPackageJson();
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
      return j.exportAllDeclaration(
        j.literal(`${exportPath}.js`),
        item.value.exported,
      );
    });

  // Modify import declarations
  root
    .find(j.ImportDeclaration)
    // Filter out the import statements which are dependencies
    .filter((item) => {
      item.value.loc?.source;
      const importPath = item.value.source?.value;
      return (
        typeof importPath === 'string' &&
        !importPath.startsWith('node:') && // Not node built in (with prefix)
        !nodeBuildIns.includes(importPath) && // Not node built in (without prefix)
        !importPath.endsWith('.js') && // Not already a transformed path
        !dependencies.some((dep) => dep === importPath)
      ); // Not a dep or dev dep
    })
    .replaceWith((item) => {
      const importPath = item.value.source.value;
      const importedFilePath = resolve(
        currentModuleDirectoryPath,
        importPath as string,
      );
      const barrelFilePath = resolve(importedFilePath, 'index.ts');
      if (
        typeof importPath === 'string' &&
        !importPath.endsWith('/index') &&
        existsSync(barrelFilePath)
      ) {
        return j.importDeclaration(
          item.value.specifiers,
          j.literal(`${importPath}/index.js`),
        );
      }
      return j.importDeclaration(
        item.value.specifiers,
        j.literal(`${importPath}.js`),
      );
    });

  return root.toSource({ quote: 'single' });
};

export default MyTransform;
