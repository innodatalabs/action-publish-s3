import { main } from './main.js';

const directory          = '.';
const namePattern        = 'haha{{TODAY_YMD}}-{{TODAY_YMD}}';
const targetPattern      = 's3://some-bucket/temp/{{NAME}}.zip';
const acl                = 'public-read';
const awsAccessKeyId     = '';
const awsSecretAccessKey = '';

const { bucket, key } = await main({
    directory,
    namePattern,
    targetPattern,
    acl,
    awsAccessKeyId,
    awsSecretAccessKey,
});

console.log('location-s3', `s3://${bucket}/${key}`);
console.log('location-http', `https://s3.amazonaws.com/${bucket}/${key}`);
