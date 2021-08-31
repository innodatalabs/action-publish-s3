const { main } = require('./main.js');

(async () => {
    const directory          = '.';
    const namePattern        = 'haha{{TODAY_YMD}}-{{TODAY_YMD}}';
    const targetPattern      = 's3://some-bucket/temp/{{NAME}}.zip';
    const acl                = 'public-read';
    const awsAccessKeyId     = '';
    const awsSecretAccessKey = '';

    const [bucket, key] = await main(directory, namePattern, targetPattern, acl, awsAccessKeyId, awsSecretAccessKey);

    core.setOutput('location-s3', target);
    core.setOutput('location-http', `https://s3.amazonaws.com/${bucket}/${key}`);
})();
