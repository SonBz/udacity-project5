import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger';

const logger = createLogger('AttachmentUtils')

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// FINISH: Implement the fileStogare logic
const bucketName = process.env.FINISH_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({signatureVersion: 'v4'});

export class AttachmentUtils{

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly finishTable = process.env.FINISH_TABLE) {
    }

    async createAttachmentPresignedUrl (finishId: string): Promise<string> {
        return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: finishId,
        Expires: parseInt(urlExpiration)
      });
   }

    async updateFinishAttachmentUrl(finishId: string, attachmentUrl: string, userId: string){
        logger.info(`updateFinishAttachmentUrl finishId ${finishId} with attachmentUrl ${attachmentUrl}`)

        await this.docClient.update({
            TableName: this.finishTable,
            Key: {
                finishId: finishId,
                userId: userId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${finishId}`
            }
        }).promise();
    }

}
