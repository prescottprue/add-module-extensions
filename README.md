# jscodeshift-esm

> Jscodeshift transform to convert CommonJS into an ECMAScript module

## Features
* Transform Typescript/Javascript modules to include extensions (required for `type: "module"`)
* Automatically append `index.js` for references to index (i.e. if `some/index.ts` exists imports of `some` will be transformed to `some/index.js`)

## Usage

1. Add `"type": "module"` to package.json
1. Run jscodeshift on your project with the jscodeshift-esm transform:

```bash
npx jscodeshift -t https://github.com/prescottprue/jscodeshift-esm/blob/v1/dist/transformExtensions.js --extensions=ts --parser=tsx --gitignore src
```

## Limitations

* Currently only checks for existing barrel files in Typescript - soon will suport JS

## Plans
* Instructions on using from npm instead of git branch
* Support for type assertion on json imports when using typescript
