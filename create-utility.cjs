const [, , ...tokens] = process.argv;
const token = tokens.join(' ');

/**
 * If a token is in kebab case or not
 * @param {string} token module name
 */
function isValidKebabCase(token) {
    const kebabRegex = /^[a-z-]+[a-z]$/;
    return token.match(kebabRegex) !== null;
}

if (!isValidKebabCase(token)) {
    throw new Error(
        `${token} is not in kebab case. Example of kebab case token is: word-finder, word-to-pascal, etc.`,
    );
}

const fs = require('fs');
const path = require('path');

const indexPath = path.join('src', 'index.ts');
const indexFileContent = fs.readFileSync(indexPath).toString();
const moduleExportStatement = `export * from './${token}/${token}'`;
if (indexFileContent.indexOf(moduleExportStatement) > 0) {
    throw new Error(`${token} is already exported by src/index.ts`);
}

const moduleTemplatePath = path.join('template', 'module.ts');
const moduleSpecTemplatePath = path.join('template', 'module.spec.ts');
const moduleTemplate = fs.readFileSync(moduleTemplatePath).toString();
const moduleSpecTemplate = fs.readFileSync(moduleSpecTemplatePath).toString();

/**
 * Returns the camel case of the kebab-cased token
 * @param {string} token kebab case token
 * @returns {string}
 */
function kebabToCamelCase(token) {
    return token.replace(/-./g, (x) => x[1].toUpperCase());
}

const kebabToken = token;
const camelCaseToken = kebabToCamelCase(kebabToken);

const filename = `${kebabToken}.ts`;
const specFilename = `${kebabToken}.spec.ts`;

const targetDirectory = path.join('src', kebabToken);
const filePath = path.join(targetDirectory, filename);
const specFilePath = path.join(targetDirectory, specFilename);

console.info(`:: Creating module directory: ${targetDirectory}`);
fs.mkdirSync(targetDirectory, {
    recursive: true,
});

const moduleToken = 'moduleToken';
const moduleKebabToken = 'module-kebab-token';

console.info(`:: Transforming module file: ${filePath}`);
const moduleContent = moduleTemplate
    .replaceAll('moduleToken', camelCaseToken)
    .replaceAll(moduleKebabToken, kebabToken);
fs.writeFileSync(filePath, moduleContent);

console.info(`:: Transforming spec file: ${specFilePath}`);
const moduleSpecContent = moduleSpecTemplate
    .replaceAll('moduleToken', camelCaseToken)
    .replaceAll(moduleKebabToken, kebabToken);
fs.writeFileSync(specFilePath, moduleSpecContent);

console.info(':: Adding export in index.ts');
const newIndexFileContent = `${indexFileContent}${moduleExportStatement}`;
fs.writeFileSync(indexPath, newIndexFileContent);

console.info(':: Linting');
var exec = require('child_process').exec;
exec('npm run lint', (err, stdout, stderr) => {
    if (err) throw err;
    if (stdout) {
        console.info(stdout);
    }
    if (stderr) {
        console.info(stderr);
    }

    console.info('Done!');
});
