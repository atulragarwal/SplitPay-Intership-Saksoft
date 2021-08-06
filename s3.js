const S3 = require('aws-sdk/clients/s3')
require('dotenv').config()
const fs = require('fs')

const bucketName = process.env.AWS_BUCKET_NAME
const bucketRegion = process.env.AWS_BUCKET_REGION
const bucketAccess = process.env.AWS_ACCESS_KEY_ID
const bucketSecret = process.env.AWS_SECRET_ACCESS_KEY
const s3 = new S3({
    bucketRegion,
    bucketAccess,
    bucketSecret
})

function uploadS3(file){
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}

function getImageS3(fileKey){
    const downParam = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downParam).createReadStream()
}

exports.uploadS3 = uploadS3
exports.getImageS3 = getImageS3