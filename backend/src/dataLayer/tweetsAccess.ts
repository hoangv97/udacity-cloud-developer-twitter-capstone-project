import * as AWS from 'aws-sdk'
import * as AWSXray from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TweetItem } from '../models/TweetItem'
import { TweetUpdate } from '../models/TweetUpdate'

// /TODO: Implement the dataLayer logic
const XAWS = AWSXray.captureAWS(AWS);

export class TweetsAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly tweetsTable = process.env.TWEETS_TABLE
  ) { }

  async getTweet(userId: string, tweetId: string): Promise<TweetItem> {
    const result = await this.docClient
      .get({
        TableName: this.tweetsTable,
        Key: { userId, tweetId }
      })
      .promise()

    return result.Item as TweetItem
  }

  async getAllTweets(userId: string): Promise<TweetItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.tweetsTable,
        KeyConditionExpression: '#userId = :i',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':i': userId
        }
      })
      .promise()
    return result.Items as TweetItem[]
  }

  async createTweet(tweet: TweetItem): Promise<TweetItem> {
    await this.docClient
      .put({
        TableName: this.tweetsTable,
        Item: tweet
      })
      .promise()
    return tweet
  }

  async deleteTweet(userId: string, tweetId: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.tweetsTable,
      Key: { userId, tweetId }
    }).promise()
  }

  async updateTweet(userId: string, tweetId: string, updatedTweet: TweetUpdate): Promise<void> {
    await this.docClient.update({
      TableName: this.tweetsTable,
      Key: { userId, tweetId },
      UpdateExpression: "set content=:n, #p=:public",
      ExpressionAttributeValues: {
        ":n": updatedTweet.content,
        ":public": updatedTweet.public,
      },
      ExpressionAttributeNames: { '#p': 'public' },
      ReturnValues: "NONE"
    }).promise()
  }

  async updateAttachment(userId: string, tweetId: string, downloadUrl: string): Promise<void> {
    await this.docClient.update({
      TableName: this.tweetsTable,
      Key: { userId, tweetId },
      UpdateExpression: "set attachmentUrl=:a",
      ExpressionAttributeValues: {
        ":a": downloadUrl
      },
      ReturnValues: "NONE"
    }).promise()
  }
}
