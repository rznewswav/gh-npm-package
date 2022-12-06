## Newswav Internal NPM Package

# Module specification

All module files must be in their own directory and paired with their spec file.

```
src/
├─ kebab-case-module/
│  ├─ kebab-case-module.ts
│  ├─ kebab-case-module.spec.ts
```

# External dependencies

If an external dependencies is required, make sure they are installed as optional dependency with this command:

```sh
npm install --save-optional [...package names]
```

# How to add common module

Use the command

```sh
npm run create module-in-kebab-case
```

This will create two files (main file, and a spec file) in the source and update the `exports` field in `package.json`.

However, if you need to manually create these files, please make sure to update the `exports` field
in `package.json` so that it can be imported by dependant projects.
