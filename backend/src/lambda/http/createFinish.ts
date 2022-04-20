import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateFinishRequest } from '../../requests/CreateFinishRequest'
import { getUserId } from '../utils';
import { createFinishForUser } from '../../helpers/finish'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newFinish: CreateFinishRequest = JSON.parse(event.body)
    const userId = await getUserId(event);
    const finishId = await createFinishForUser(userId, newFinish);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item:
            {
              finishId: finishId,
              ...newFinish
            }
      })
    };
  }
)

handler.use(
  cors({
    credentials: true
  })
)
