import { getFinishsForUser } from './../../helpers/finish';
import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'

// FINISH: Get all FINISH items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = await getUserId(event);
    const finishItem = await getFinishsForUser(userId);  
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
  
