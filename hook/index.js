const path = require("path");
async function preInit(inputObj) {
  const logger = new inputObj.Logger("");
  if (process.env["CLI_VERSION"] < "2.1.7") {
    logger.log(
      'Please upgrade the CLI version to 2.1.7 or above, and you can execute the command "npm i @serverless-devs/s -g --registry=https://registry.npmmirror.com" to upgrade.',
      "yellow"
    );
  }
}

async function postInit(inputObj) {
  inputObj.artTemplate("s.base.yaml");
  inputObj.artTemplate("generate.yaml");
  const syaml = path.join(inputObj.targetPath, "generate.yaml");
  console.log(`
    \n Cloud resources are being created...
    `);

  try {
    await inputObj.execCommand({
      syaml,
      method: "generate",
    });
  } catch (ex) {
    const logger = new inputObj.Logger("");
    logger.log(`\nGenerate resource error: ${ex.message}\n`, "red");
    logger.log(`\nPlease use 's generate -t ${syaml}' try again\n`, "yellow");
  }
  console.log(`
  \n Cloud resource creation is complete
  \n Execute the command " s deploy " and enjoy!
  `);
}

module.exports = {
  postInit,
  preInit,
};
