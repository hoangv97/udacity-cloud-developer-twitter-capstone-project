import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTweet } from '../../helpers/tweets'
import { UpdateTweetRequest } from '../../requests/UpdateTweetRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const tweetId = event.pathParameters.tweetId
    const updatedTweet: UpdateTweetRequest = JSON.parse(event.body)
    // /TODO: Update a Tweet item with the provided id using values in the "updatedTweet" object
    const userId = getUserId(event)
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
