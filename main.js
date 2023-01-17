const AdmZip = require('adm-zip');
const { S3 } = require('@aws-sdk/client-s3');
const fs = require('fs').promises;

function padded(number) {
    return ('0' + number).slice(-2)
}

function getYMD() {
    const date = new Date();
    return '' + date.getUTCFullYear() + padded(date.getUTCMonth()+1) + padded(date.getUTCDate());
}

function resolve(context, variable) {
    let value = context;
    for (let x of variable.split('.')) {
        value = value[x];
        if (value === undefined) {
            throw new Error(`Could not find variable ${variable}`);
        }
    }

    return '' + value;
}

function extrapolate(pattern, context) {
    const re = /{{(.+?)}}/g;

    const text = [];
    let offset = 0;
    while (true) {
        const m = re.exec(pattern);
        if (!m) {
            break;
        }
        text.push(pattern.slice(offset, re.lastIndex - m[0].length));
        text.push(resolve(context, m[1]));
        offset = re.lastIndex;
    }
    text.push(pattern.slice(offset, pattern.length));

    return text.join('');
}

function parseS3(s3url) {
    const m = /s3:\/\/([^\/]+)\/(.+)$/.exec(s3url);
    if (!m || m.length != 3) {
        throw new Error(`Could not parse ${s3url}`);
    }
    return [m[1], m[2]];
}

async function main({
    directory,
    namePattern,
    targetPattern,
    acl,
    awsAccessKeyId,
    awsSecretAccessKey,
    awsRegion,
}) {
    const TODAY_YMD = getYMD();

    const name   = extrapolate(namePattern, {...process.env, TODAY_YMD})
    const target = extrapolate(targetPattern, {...process.env, TODAY_YMD, 'NAME': name})
    if (!target.startsWith('s3://')) {
        throw new Error('Target must start with "s3://"');
    }

    const zipper = new AdmZip();
    zipper.addLocalFolder(directory, name);
    const zipBody = zipper.toBuffer();

    const [ bucket, key ] = parseS3(target);

    const s3 = new S3({
        credentials: {
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
        },
        region: awsRegion,
    });

    await s3.putObject({
        Bucket: bucket,
        Key   : key,
        Body  : zipBody,
        ACL   : acl,
    }).promise();

    return { bucket, key };
}

module.exports.main = main;