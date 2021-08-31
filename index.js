const core = require('@actions/core');
const { main } = require('./main.js');

(async () => {
    const directory          = core.getInput('directory');
    const namePattern        = core.getInput('name-pattern');
    const targetPattern      = core.getInput('target-pattern');
    const acl                = core.getInput('acl');
    const awsAccessKeyId     = core.getInput('aws-access-key-id');
    const awsSecretAccessKey = core.getInput('aws-secret-access-key');

    const [bucket, key] = await main(directory, namePattern, targetPattern, acl, awsAccessKeyId, awsSecretAccessKey);

    core.setOutput('location-s3', target);
    core.setOutput('location-http', `https://s3.amazonaws.com/${bucket}/${key}`);
})().catch(error => core.setFailed(error.message));
