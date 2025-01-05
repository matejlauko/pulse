import { createIssue, getIssueUrl } from '@/lib/linear'
import { getLogger } from '@/lib/logger'
import type { IPostWithInsights } from '@/post'

const { captureError, log } = getLogger('load')

export type LoadIssueResult = { url: string }

export async function loadIssue(post: IPostWithInsights): Promise<LoadIssueResult> {
  log('loadIssue', { post })

  try {
    const issue = await createIssue({
      title: post.title,
      description: post.text,
      priority: post.priority,
      category: post.category,
    })

    const url = getIssueUrl(issue.identifier)

    log('loadIssue', { issue, url })

    return { url }
  } catch (error) {
    captureError(error, 'loadIssue', { post })

    throw error
  }
}
