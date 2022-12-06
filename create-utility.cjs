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

console.info(':: Entering async process...');

/**
 * @param {string} command command
 * @returns {Promise<T>}
 */
function execAsync(command) {
  const exec = require('child_process').exec;
  return new Promise((res, rej) =>
    exec(command, (err, stdout, stderr) => {
      if (err) {
        rej(err);
        return;
      }
      res({ stdout, stderr });
    }),
  );
}

/**
 * Returns the camel case of the kebab-cased token
 * @param {string} token kebab case token
 * @returns {string}
 */
function kebabToCamelCase(token) {
  return token.replace(/-./g, (x) => x[1].toUpperCase());
}

async function module() {
  const moduleTemplatePath = path.join('template', 'module.ts');
  const moduleSpecTemplatePath = path.join('template', 'module.spec.ts');
  const moduleTemplate = fs.readFileSync(moduleTemplatePath).toString();
  const moduleSpecTemplate = fs.readFileSync(moduleSpecTemplatePath).toString();

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

  const moduleCamelToken = 'moduleCamelToken';
  const moduleKebabToken = 'module-kebab-token';

  console.info(`:: Transforming module file: ${filePath}`);
  const moduleContent = moduleTemplate
    .replaceAll(moduleCamelToken, camelCaseToken)
    .replaceAll(moduleKebabToken, kebabToken);
  fs.writeFileSync(filePath, moduleContent);

  console.info(`:: Transforming spec file: ${specFilePath}`);
  const moduleSpecContent = moduleSpecTemplate
    .replaceAll(moduleCamelToken, camelCaseToken)
    .replaceAll(moduleKebabToken, kebabToken);
  fs.writeFileSync(specFilePath, moduleSpecContent);

  console.info(':: Linting');
  await execAsync('npm run lint');

  console.info(':: Updating exports');
  const packageJson = require('./package.json');
  packageJson['exports'] = packageJson['exports'] ?? {};
  packageJson['exports'][
    `./${kebabToken}`
  ] = `./${kebabToken}/${kebabToken}.js`;
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
}

module();
