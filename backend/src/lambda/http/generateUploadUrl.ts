import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import {createAttachmentPresignedUrl, updateFinishAttachmentUrl } from '../../helpers/finish'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const finishId = event.pathParameters.finishId
    const userId = getUserId(event)
    // FINISH: Return a presigned URL to upload a file for a FINISH item with the provided id
    const uploadUrl = await createAttachmentPresignedUrl(finishId);
    await updateFinishAttachmentUrl(finishId, uploadUrl, userId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
