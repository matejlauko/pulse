import type { Category } from '@/modules/transform/categorize'
import type { Priority } from '@/modules/transform/insights'
import { rootStore } from '@/root-store'
import { getLogger } from './logger'
import { request } from './request'

const { log, captureError } = getLogger('linear')

const LINEAR_API_URL = 'https://api.linear.app/graphql'
const TEAM_ID = '15a1e710-b907-4679-b91c-7c7a846cc4fe'

const CATEGORY_LABEL_ID_MAP: { [C in Category]?: string } = {
  bug: '7aff769f-9600-49ba-903a-94cc2878a072',
  request: '61f5dbfa-1703-43b6-83fc-b1c1fa976a2a',
}

const PRIORITY_MAP: Record<Priority, number> = {
  urgent: 1,
  high: 2,
  normal: 3,
  low: 4,
}

export async function createIssue({
  title,
  description,
  priority,
  category,
}: {
  title: string
  description: string
  priority: Priority
  category: Category
}): Promise<{ id: string; identifier: string }> {
  const priorityNumber = PRIORITY_MAP[priority] ?? 0
  const categoryLabelId = CATEGORY_LABEL_ID_MAP[category] ?? CATEGORY_LABEL_ID_MAP.bug

  log('createIssue', { title, description, priorityNumber, categoryLabelId })

  try {
    const escapedTitle = escapeLinearString(title)
    const escapedDescription = escapeLinearString(description)

    const payload = await request<{
      data: { issueCreate: { success: boolean; issue: { id: string; identifier: string } } }
    }>(LINEAR_API_URL, {
      method: 'POST',
      authToken: rootStore.linearApiKey,
      data: {
        query: `mutation IssueCreate {
          issueCreate(
            input: {
              teamId: "${TEAM_ID}"
              title: "${escapedTitle}"
              description: "${escapedDescription}"
              priority: ${priorityNumber}
              labelIds: ["${categoryLabelId}"]
            }
          ) {
            success
            issue {
              id
              identifier
            }
          }
        }
      `,
      },
    })

    log('createIssue', { payload })

    return payload.data.issueCreate.issue
  } catch (error) {
    captureError(error, 'createIssue', { title, description, priority })

    throw error
  }
}

export function getIssueUrl(issueIdentifier: string) {
  return `https://linear.app/issue/${issueIdentifier}`
}

// Escape special characters and convert newlines to \n
const escapeLinearString = (str: string) =>
  str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')
