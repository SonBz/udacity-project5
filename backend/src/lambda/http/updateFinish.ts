import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateFinishRequest } from '../../requests/UpdateFinishRequest'
import { getUserId } from '../utils'
import { updateFinish } from '../../helpers/finish'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const finishId = event.pathParameters.finishId
    console.log(event.body);
    const updatedFinish: UpdateFinishRequest = JSON.parse(event.body)
    const userId = await getUserId(event);
    // FINISH: Update a FINISH item with the provided id using values in the "updatedFinish" object
    await updateFinish(userId, finishId, updatedFinish)
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
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
