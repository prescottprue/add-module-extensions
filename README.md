# jscodeshift-module-extensions

> Jscodeshift transform to add file extensions to import/export statements for use with `type: "module"`


## Features
* Transform Typescript/Javascript modules to include extensions (required for `type: "module"`)
* Automatically append `index.js` for references to index (i.e. if `some/index.ts` exists imports of `some` will be transformed to `some/index.js`)

## Usage

```bash
yarn dlx jscodeshift -t https://github.com/prescottprue/add-module-extensions/blob/v1/dist/transformExtensions.js --extensions=ts --parser=tsx --gitignore src
```

## Limitations

* Currently only checks for existing barrel file