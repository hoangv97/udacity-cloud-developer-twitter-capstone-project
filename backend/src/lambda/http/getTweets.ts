import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getTweetsForUser } from '../../businessLogic/tweets'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('tweets')

// /TODO: Get all Tweet items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    logger.info(`user ${userId} get their tweets`)
    const tweets = await getTweetsForUser(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: tweets
      })
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
