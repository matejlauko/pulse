import { rootStore } from '@/root-store'
import Anthropic from '@anthropic-ai/sdk'
import { getLogger } from './logger'
import { withRetry } from './request'

const { log, captureError } = getLogger('ai-api')

export const AIModels = {
  Big: 'claude-3-5-sonnet-latest',
  Small: 'claude-3-5-haiku-latest',
} as const
export type AIModel = (typeof AIModels)[keyof typeof AIModels]

let anthropic: Anthropic | undefined

function createAnthropic(): Anthropic {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: rootStore.anthropicApiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  return anthropic
}

/**
 * Calls AI (Anthropic) to create a completion message.
 * Implements rate limiting retry.
 */
export async function createCompletion({
  prompt,
  model,
  maxTokens = 1024,
  systemPrompt,
  examples = [],
  jsonMode = false,
}: {
  prompt: string
  model: AIModel
  maxTokens?: number
  systemPrompt?: string
  examples?: Array<[string, string]>
  jsonMode?: boolean
}): Promise<string> {
  log('createCompletion', { prompt, model, maxTokens, systemPrompt })

  // const exampleMessages: Anthropic.MessageParam[] = examples.flatMap(([prompt, output]) => [
  //   { role: 'user', content: prompt },
  //   { role: 'assistant', content: output },
  // ])

  const assistantMessage: Anthropic.MessageParam | undefined = jsonMode
    ? {
        role: 'assistant',
        content: '{',
      }
    : undefined

  const userMessage: Anthropic.MessageParam = examples
    ? {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `<examples>\n${examples.map(([prompt, output]) => `<example>${prompt}<ideal_output>${output}</ideal_output></example>`).join('\n')}\n</examples>`,
          },
          { type: 'text', text: prompt },
        ],
      }
    : {
        role: 'user',
        content: prompt,
      }

  const messages: Anthropic.MessageParam[] = [
    userMessage,
    ...(assistantMessage ? [assistantMessage] : []),
  ]

  const anthropic = createAnthropic()

  try {
    const message = await withRetry(
      () =>
        anthropic.messages.create({
          model,
          max_tokens: maxTokens,
          system: systemPrompt,
          messages,
          stop_sequences: jsonMode ? ['}'] : undefined,
        }),
      {
        getRetryDelay(error) {
          const resetDateHeader = error.headers['anthropic-ratelimit-requests-reset']

          if (resetDateHeader) {
            const resetDate = new Date(resetDateHeader)
            const now = new Date()
            return resetDate.getTime() - now.getTime()
          }
        },
      }
    )

    const content = message.content[0]

    log('createCompletion', { content })

    // Must add curly braces to the output in JSON mode to substitute the assistant prefill and stop sequence
    if (content.type === 'text' && jsonMode) {
      return `{ ${content.text} }`
    }

    if (content.type === 'text') {
      return content.text
    }

    throw new Error('Unexpected content type')
  } catch (error) {
    captureError(error, 'createCompletion')

    throw error
  }
}

// export async function fixJsonCompletion<T extends object>(completion: string): Promise<T> {
//   try {
//     return JSON.parse(completion)
//   } catch (error) {

//   const fixed = completion.replace(/[^a-zA-Z0-9]/g, '')
//   return JSON.parse(fixed)
// }
