import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTweet } from '../../businessLogic/tweets'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';

const logger = createLogger('tweets')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const tweetId = event.pathParameters.tweetId
    // /TODO: Remove a Tweet item by id
    const userId = getUserId(event)
    logger.info(`user ${userId} delete tweet ${tweetId}`)
    await deleteTweet(userId, tweetId)

    return {
      statusCode: 201,
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
