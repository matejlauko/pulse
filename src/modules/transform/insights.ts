import { AIModels, createCompletion } from '@/lib/ai-api'
import { getLogger } from '@/lib/logger'
import type { IPostWithCategory } from '@/post'

const { log, captureError } = getLogger('categorize')

export const PriorityList = ['urgent', 'high', 'normal', 'low'] as const
export type Priority = (typeof PriorityList)[number]

const SystemPrompt = `You are an expert Product Management AI assistant. You will be provided a user feedback from Reddit for a B2B SaaS - project management tool, along with category classification (bug/request/question), already done with your AI colleague.  Your job is to extract insights from user feedback. The insight should be clear, concise, to the point, but general enough, so it covers the whole group of related bugs/requests. It should help the PM triage it as fast as possible. Also provide priority for bugs and feature requests, based on you PM expertise, on a scale: ${PriorityList.join(', ')}. Respond in valid JSON format, with with keys: "insight" and "priority" only!`

const PromptTemplate = `<title>{title}</title>\n<text>{text}</text>\n<category>{category}</category>`

const Examples: Array<[string, string]> = [
  [
    '<title>Creating a project in the app</title><text>Not sure if it’s by design or just an oversight but there doesn’t seem to be a way of creating a project in the app. Hoping this gets added soon.</text><category>request</category>',
    JSON.stringify({
      insight: 'Ability to create project inside the app',
      priority: 'minor',
    }),
  ],
  [
    "<title>Email verification not sending (to my icloud email)</title><text>currently i'm using gmail but i want to switch to my icloud email, i need to verify it, I'm checking my inbox, nothing</text><category>bug</category>",
    JSON.stringify({
      insight: 'Email verification not sending',
      priority: 'major',
    }),
  ],
  [
    '<title>Any thoughts on creating the typing interface to be more like Notion?</title><category>request</category>',
    JSON.stringify({
      insight: 'Improve text editor interface',
      priority: 'low',
    }),
  ],
]

export type ExtractInsightsResult = { insight: string; priority: Priority }

/**
 * Calls AI (Anthropic) to categorize post to one of: bug, request, question, other
 */
export async function extractInsights(post: IPostWithCategory): Promise<ExtractInsightsResult> {
  log('extractInsights', { post })

  const prompt = PromptTemplate.replace('{title}', post.title)
    .replace('{text}', post.text.slice(0, 200))
    .replace('{category}', post.category)
  try {
    const completion = await createCompletion({
      prompt,
      model: AIModels.Small,
      maxTokens: 256,
      systemPrompt: SystemPrompt,
      examples: Examples,
      jsonMode: true,
    })

    log('extractInsights', { postId: post.id, completion })

    return JSON.parse(completion)
  } catch (error) {
    captureError(error, 'extractInsights', { post })

    throw error
  }
}
