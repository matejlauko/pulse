import type { Category } from '@/modules/transform/categorize'
import type { Priority } from '@/modules/transform/insights'
import { Post, type IPost } from '@/post'
import { postsStore } from '@/posts'
import { runInAction } from 'mobx'
import demoPosts from './demo.json'
import { sleep } from './utils'

const { posts, categoryMap, priorityMap, insightMap } = (demoPosts as IPost[]).reduce<{
  posts: IPost[]
  categoryMap: Record<string, Category>
  priorityMap: Record<string, Priority>
  insightMap: Record<string, string>
}>(
  (acc, post) => {
    acc.posts.push({
      ...post,
      category: undefined,
      priority: undefined,
      insight: undefined,
    })
    acc.categoryMap[post.id] = post.category ?? 'other'
    acc.priorityMap[post.id] = post.priority ?? 'normal'
    acc.insightMap[post.id] = post.insight ?? ''
    return acc
  },
  { posts: [], categoryMap: {}, priorityMap: {}, insightMap: {} }
)

async function load(setData: () => void, setState: (state: 'loading' | 'done') => void) {
  runInAction(() => setState('loading'))

  await sleep(3000)

  runInAction(() => {
    setState('done')
    setData()
  })
}

export async function demo() {
  await load(
    () => {
      postsStore.posts = posts.map((post) => {
        const p = new Post(postsStore, post)
        p.categorizationState = 'done'
        p.insightState = 'done'
        return p
      })
    },
    (s) => {
      postsStore.extractionState = s
    }
  )

  for (const post of postsStore.posts) {
    load(
      () => (post.category = categoryMap[post.id]),
      (s) => {
        post.categorizationState = s
      }
    )
    await sleep(100)
    load(
      () => {
        post.insight = insightMap[post.id]
        post.priority = priorityMap[post.id]
      },
      (s) => {
        post.insightState = s
      }
    )
    await sleep(100)
  }
}
