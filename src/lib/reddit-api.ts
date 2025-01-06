import { getLogger } from './logger'
import { request, withRetry } from './request'

export const REDDIT_BASE_URL = 'https://www.reddit.com'

const { log, captureError } = getLogger('reddit-api')

export interface RedditPost {
  data: {
    author: string
    created_utc: number
    id: string
    name: string
    permalink: string
    selftext_html: string
    selftext: string
    title: string
    url: string
  }
}

export interface RedditResponse {
  data: {
    children: RedditPost[]
    after: string | null
  }
}

/**
 * Fetches posts from Reddit.
 * Implements rate limiting retry.
 */
export async function fetchFromReddit(
  path: string
): Promise<{ posts: RedditPost[]; after: string | null }> {
  const url = `${REDDIT_BASE_URL}${path}`

  log('fetchFromReddit', { url })

  try {
    const response = await withRetry(
      () =>
        request<RedditResponse>(url, {
          // signal: abortController.signal, TODO: implement abort
        }),
      {
        rateLimitResetHeader: 'x-ratelimit-reset',
      }
    )

    const data = response.data

    log('fetchFromReddit', { data })

    return {
      posts: data.children,
      after: data.after,
    }
  } catch (error) {
    captureError(error, 'fetchFromReddit')
    throw error
  }
}

/**
 * Fetches all posts from a subreddit by paginating using the `after` parameter.
 */
export async function fetchSubredditPosts(subreddit: string): Promise<RedditPost[]> {
  const allPosts: RedditPost[] = []
  let currAfter: string | null = null

  log('fetchSubredditPosts', { subreddit })

  try {
    do {
      const path = `/r/${subreddit}/new.json${currAfter ? `?after=${currAfter}` : ''}`

      const response = await fetchFromReddit(path)
      const posts = response.posts.slice(0, 10)

      allPosts.push(...posts)
      currAfter = response.after
    } while (currAfter)

    log('fetchSubredditPosts', { allPosts })

    return allPosts
  } catch (error) {
    captureError(error, 'fetchSubredditPosts')

    throw error
  }
}
