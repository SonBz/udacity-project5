import { getFinishById } from './../../helpers/finish';
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const finishId = event.pathParameters.finishId
    console.log(finishId);
    const userId = await getUserId(event);
    const finishItem = await getFinishById(userId, finishId); 
    console.log(finishItem); 
    return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
          items: finishItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
  
