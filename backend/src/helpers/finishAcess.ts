import { UpdateFinishRequest } from './../requests/UpdateFinishRequest';
import { CreateFinishRequest } from './../requests/CreateFinishRequest';
import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { FinishItem } from '../models/FinishItem'
import * as uuid from 'uuid'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('FinishsAccess')

export class FinishsAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly finishTable = process.env.FINISH_TABLE,
        ) {
    }

    async getFinishsForUser(userId: string): Promise<FinishItem[]> {
        logger.info(`getFinishsForUser by ${userId}`);
        const result = await this.docClient.query({
            TableName: this.finishTable,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            },
            ScanIndexForward: false
        }).promise();

        const items = result.Items
        console.log("db: ", result);
        return items as FinishItem[]
    }

    async getFinishById(userId: string, finishId: string): Promise<FinishItem> {
        logger.info(`getFinishById by ${userId}`);
        const result = await this.docClient.get({
            TableName: this.finishTable,
            Key: {
                userId,
                finishId
            }
          }).promise()
    
        const item = result.Item
        return item as FinishItem
    }

    async createFinishForUser(userId: string, newFinish: CreateFinishRequest): Promise<string> {
        const finishId = uuid.v4();
        logger.info(`createFinishForUser with finishId: ${finishId}`);
        const newFinishWithAdditionalInfo = {
            userId: userId,
            finishId: finishId,
            createAt: new Date().toISOString(),
            done: false,
            ...newFinish
        }

        await this.docClient.put({
            TableName: this.finishTable,
            Item: newFinishWithAdditionalInfo
        }).promise();

        return finishId;

    }

    async deleteFinish(finishId: string, userId: string) {
        logger.info(`deleteFinish with finishId: ${finishId} and userId: ${userId}`);
        await this.docClient.delete({
            TableName: this.finishTable,
            Key: {
                userId: userId,
                finishId: finishId
            }
        }).promise();
    
    }

    async updateFinish(userId: String, finishId: string, updatedFinish: UpdateFinishRequest){
        logger.info(`updateFinish with finishId: ${userId} and with finishId: ${finishId}`)
        await this.docClient.update({
            TableName: this.finishTable,
            Key: {
                "finishId": finishId,
                "userId": userId
            },
            UpdateExpression: "set #finishName = :name, done = :done, dueDate = :dueDate",
            ExpressionAttributeNames: {
                "#finishName": "name"
            },
            ExpressionAttributeValues: {
                ":name": updatedFinish.name,
                ":done": updatedFinish.done,
                ":dueDate": updatedFinish.dueDate
            }
        }).promise()

    }
}