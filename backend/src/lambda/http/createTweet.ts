import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTweetRequest } from '../../requests/CreateTweetRequest'
import { getUserId } from '../utils';
import { createTweet } from '../../helpers/tweets'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTweet: CreateTweetRequest = JSON.parse(event.body)
    // /TODO: Implement creating a new Tweet item
    const userId = getUserId(event)
    const item = await createTweet(userId, newTweet)

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

handler.use(
  cors({
    credentials: true
  })
)
