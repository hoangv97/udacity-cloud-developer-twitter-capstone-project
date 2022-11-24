import * as uuid from 'uuid';
import { TweetItem } from '../models/TweetItem';
import { CreateTweetRequest } from '../requests/CreateTweetRequest';
import { UpdateTweetRequest } from '../requests/UpdateTweetRequest';
import { createLogger } from '../utils/logger';
import { AttachmentUtils } from '../storageLayer/attachmentUtils';
import { TweetsAccess } from '../dataLayer/tweetsAccess';

// /TODO: Implement businessLogic
const tweetsAccess = new TweetsAccess()
const attachmentUtils = new AttachmentUtils()

const logger = createLogger('tweets')

export async function getTweetsForUser(userId: string): Promise<TweetItem[]> {
  logger.info('get tweets for user', userId)
  const items = await tweetsAccess.getAllTweets(userId)

  return items
}

export async function createTweet(
  userId: string,
  createTweetRequest: CreateTweetRequest,
): Promise<TweetItem> {
  logger.info('create tweet for user', userId)
  const tweetId = uuid.v4()

  return await tweetsAccess.createTweet({
    userId,
    tweetId,
    createdAt: new Date().toISOString(),
    ...createTweetRequest
  } as TweetItem)
}

export async function deleteTweet(userId: string, tweetId: string): Promise<void> {
  logger.info('delete tweet', tweetId)
  // Delete attachment object from S3
  await attachmentUtils.deleteAttachment(tweetId)
  await tweetsAccess.deleteTweet(userId, tweetId)
}

export async function updateTweet(userId: string, tweetId: string, updatedTweet: UpdateTweetRequest): Promise<void> {
  const validTweet = await tweetsAccess.getTweet(userId, tweetId)

  if (!validTweet) {
    throw new Error('404')
  }

  return await tweetsAccess.updateTweet(userId, tweetId, updatedTweet)
}


export async function createAttachmentPresignedUrl(userId: string, tweetId: string): Promise<string> {
  logger.info('create attachment url', tweetId)
  const validTweet = await tweetsAccess.getTweet(userId, tweetId)

  if (!validTweet) {
    throw new Error('404')
  }

  const uploadUrl = attachmentUtils.getUploadUrl(tweetId)
  const downloadUrl = attachmentUtils.getDownloadUrl(tweetId)
  await tweetsAccess.updateAttachment(userId, tweetId, downloadUrl)
  return uploadUrl
}
