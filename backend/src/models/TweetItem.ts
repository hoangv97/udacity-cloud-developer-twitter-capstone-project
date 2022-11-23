export interface TweetItem {
  userId: string
  tweetId: string
  createdAt: string
  content: string
  public: boolean
  attachmentUrl?: string
}
