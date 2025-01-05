import { AIModels, createCompletion } from '@/lib/ai-api'
import { getLogger } from '@/lib/logger'
import type { IPost } from '@/post'

const { log, captureError } = getLogger('categorize')

export const CategoryList = ['bug', 'request', 'question', 'other'] as const
export type Category = (typeof CategoryList)[number]

const CategoryDescriptions: Record<Category, string> = {
  bug: 'A bug report, something not working as expected',
  request: 'A feature request or idea, something the user would want in the product',
  question: 'Question about the product itself',
  other: 'Others, not relevant to the product',
}

const SystemPrompt = `You are an expert AI assistant trained to categorize user feedback in public discussions. Your goal is to help Product manager of a B2B SaaS in analyzing user feedback for a product - project management tool for tech companies. Categorize post given by user into given categories below. Return only the category name and nothing else!\n<categories>\n${CategoryList.map((cat) => `<category><name>${cat}</name><description>${CategoryDescriptions[cat]}</description></category>`).join('\n')}\n</categories>`

const PromptTemplate = `<title>{title}</title><text>{text}</text>`

const Examples: Array<[string, string]> = [
  [
    '<title>Creating a project in the app</title><text>Not sure if it’s by design or just an oversight but there doesn’t seem to be a way of creating a project in the app. Hoping this gets added soon.</text>',
    'request',
  ],
  [
    '<title>Training courses</title><text>Is there any in depth training courses for PM newbies to fast track their way…</text>',
    'question',
  ],
  [
    '<title>Dock notifications label not showing number count.</title><text>Am I missing a setting or something?</text>',
    'bug',
  ],
  [
    '<title>Recommendations for a project brief template</title><text>I want to create a template for a product brief</text>',
    'other',
  ],
  ['<title>Difficulty with selecting text that requires scrolling in a code block</title>', 'bug'],
]

/**
 * Calls AI (Anthropic) to categorize post to one of: bug, request, question, other
 */
export async function categorizePost(post: IPost): Promise<Category> {
  log('categorizePost', { post })

  const prompt = PromptTemplate.replace('{title}', post.title).replace(
    '{text}',
    post.text.slice(0, 150)
  )
  try {
    const category = await createCompletion({
      prompt,
      model: AIModels.Big,
      maxTokens: 10,
      systemPrompt: SystemPrompt,
      examples: Examples,
    })

    if (!CategoryList.includes(category as Category)) {
      throw new Error(`Invalid category: ${category} [postId: ${post.id}]`)
    }

    log('categorizePost', { postId: post.id, category })

    return category as Category
  } catch (error) {
    captureError(error, 'categorizePost', { post })

    throw error
  }
}
