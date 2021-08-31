const core = require('@actions/core');
const { main } = require('./main.js');

function sleep(howlong) {
    return new Promise( resolve => setTimeout(resolve, howlong));
}

(async () => {
    const directory          = core.getInput('directory');
    const namePattern        = core.getInput('name-pattern');
    const targetPattern      = core.getInput('target-pattern');
    const acl                = core.getInput('acl');
    const awsAccessKeyId     = core.getInput('aws-access-key-id');
    const awsSecretAccessKey = core.getInput('aws-secret-access-key');

    const [bucket, key] = await main(directory, namePattern, targetPattern, acl, awsAccessKeyId, awsSecretAccessKey);

    core.setOutput('location-s3', `s3://${bucket}/${key}`);
    core.setOutput('location-http', `https://s3.amazonaws.com/${bucket}/${key}`);

    core.info(`Sleeping... ${new Date()}`);

    await sleep(20000);
    core.info(`Done... ${new Date()}`);
})().catch(error => core.setFailed(error.message));
