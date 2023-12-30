import { resolve, dirname } from 'path';
import { Transform } from 'jscodeshift';
import { getPackageJson, nodeBuildIns, shouldAppendIndex } from './utils';

export const parser = 'tsx';

const TransformModuleExtensions: Transform = (fileInfo, { jscodeshift: j }) => {
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
      const exportPath = item.value.source.value as string;
      return j.exportAllDeclaration(
        j.literal(`${exportPath}${shouldAppendIndex(currentModuleDirectoryPath, exportPath) ? '/index' : ''}.js`),
        item.value.exported,
      );
    });

  // Modify import declarations
  root
    .find(j.ImportDeclaration)
    // Filter out the import statements which are dependencies
    .filter((item) => {
      const importPath = item.value.source?.value;
      return (
        typeof importPath === 'string' &&
        !importPath.startsWith('node:') && // Not node built in (with prefix)
        !nodeBuildIns.includes(importPath) && // Not node built in (without prefix)
        !importPath.endsWith('.js') && // Not already a transformed path
        !importPath.endsWith('.json') && // Not already a JSON path
        !dependencies.some((dep) => dep === importPath)
      ); // Not a dep or dev dep
    })
    .replaceWith((item) => {
      const importPath = item.value.source.value as string;
      if (
        shouldAppendIndex(currentModuleDirectoryPath, importPath)
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

export default TransformModuleExtensions;
