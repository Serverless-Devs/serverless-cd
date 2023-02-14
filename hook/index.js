const path = require('path');
const core = require('./core');

async function preInit(inputObj) {
  const logger = new inputObj.Logger('');
  if (process.env['CLI_VERSION'] < '2.1.7') {
    logger.log(
      'Please upgrade the CLI version to 2.1.7 or above, and you can execute the command "npm i @serverless-devs/s -g --registry=https://registry.npmmirror.com" to upgrade.',
      'yellow',
    );
  }
}

async function postInit(inputObj) {
  inputObj.artTemplate('s.yaml');
  inputObj.artTemplate('generate.yaml');
  const syaml = path.join(inputObj.targetPath, 'generate.yaml');
  console.log(`
    \n Cloud resources are being created...
    `);
  const logger = new inputObj.Logger('');

  try {
    await core.execCommand({
      syaml,
      method: 'generate',
    });
    console.log(`
    \n Cloud resource creation is complete
    \n Run " s deploy "start Serverless CI/CD journey!
    `);
  } catch (ex) {
    logger.log(`\nGenerate resource error: ${ex.message}\n`, 'red');
    logger.log(`\nPlease use 's generate -t ${syaml}' try again\n`, 'red');
  }
}

module.exports = {
  postInit,
  preInit,
};
