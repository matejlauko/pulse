import { action, observable } from 'mobx'
import { ANTHROPIC_API_KEY_STORAGE_KEY, LINEAR_API_KEY_STORAGE_KEY } from './consts'

const SUBREDDIT_STORAGE_KEY = 'subreddit'

export const rootStore = observable<{
  subreddit: string
  linearApiKey: string
  anthropicApiKey: string
}>({
  subreddit: localStorage.getItem(SUBREDDIT_STORAGE_KEY) ?? '',
  linearApiKey:
    localStorage.getItem(LINEAR_API_KEY_STORAGE_KEY) ?? import.meta.env.VITE_LINEAR_API_KEY,
  anthropicApiKey:
    localStorage.getItem(ANTHROPIC_API_KEY_STORAGE_KEY) ?? import.meta.env.VITE_ANTHROPIC_API_KEY,
})

export const saveSubreddit = action((subreddit: string) => {
  rootStore.subreddit = subreddit
  localStorage.setItem(SUBREDDIT_STORAGE_KEY, subreddit)
})

export const saveSettings = action(
  ({ linearApiKey, anthropicApiKey }: { linearApiKey: string; anthropicApiKey: string }) => {
    rootStore.linearApiKey = linearApiKey
    rootStore.anthropicApiKey = anthropicApiKey

    localStorage.setItem(LINEAR_API_KEY_STORAGE_KEY, linearApiKey)
    localStorage.setItem(ANTHROPIC_API_KEY_STORAGE_KEY, anthropicApiKey)
  }
)
