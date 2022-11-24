import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateTweet } from '../../businessLogic/tweets'
import { UpdateTweetRequest } from '../../requests/UpdateTweetRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';

const logger = createLogger('tweets')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const tweetId = event.pathParameters.tweetId
    const updatedTweet: UpdateTweetRequest = JSON.parse(event.body)
    // /TODO: Update a Tweet item with the provided id using values in the "updatedTweet" object
    const userId = getUserId(event)
    logger.info(`user ${userId} update tweet ${tweetId}`)
    const item = await updateTweet(userId, tweetId, updatedTweet)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item
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
