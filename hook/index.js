const path = require('path');
async function preInit(inputObj) {

}

async function postInit(inputObj) {
  inputObj.artTemplate('s.base.yaml');
  inputObj.artTemplate('generate.yaml');
  const syaml = path.join(inputObj.targetPath, 'generate.yaml');
  console.log(`
    \n Cloud resources are being created...
    `)

  try {
    await inputObj.execCommand({
      syaml,
      method: 'generate',
    });
  } catch (ex) {
    const logger = new inputObj.Logger('');
    logger.log(`\nGenerate resource error: ${ex.message}\n`, 'red');
    logger.log(`\nPlease use 's generate -t ${syaml}' try again\n`, 'yellow');
  }
  console.log(`
  \n Cloud resource creation is complete
  \n Execute the command " s deploy " and enjoy!
  `)
}

module.exports = {
  postInit,
  preInit
}
