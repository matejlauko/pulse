import { getLogger } from '@/lib/logger'
import { fetchSubredditPosts, type RedditPost } from '@/lib/reddit-api'
import type { IPost } from '@/post'

const { log, captureError } = getLogger('extract')

export async function extractPosts(subreddit: string): Promise<IPost[]> {
  log('extractPosts')

  try {
    const payload: RedditPost[] = await fetchSubredditPosts(subreddit)

    return payload.map((post) => ({
      id: crypto.randomUUID(),
      title: post.data.title,
      text: post.data.selftext,
      authorName: post.data.author,
      source: 'reddit',
      sourceUrl: post.data.url,
      sourceCreatedAt: new Date(post.data.created_utc * 1000).toISOString(),
      sourceId: post.data.id,
    }))
  } catch (error) {
    captureError(error, 'extractPosts')

    throw error
  }
}
