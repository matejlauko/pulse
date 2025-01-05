import { flow, makeAutoObservable } from 'mobx'
import { toast } from 'sonner'
import { extractPosts } from './modules/extract/extract'
import { type IPost, Post } from './post'
import { rootStore } from './root-store'

const POSTS_STORE_KEY = 'posts'
type State = 'none' | 'loading' | 'error' | 'done'

const storedPosts = localStorage.getItem(POSTS_STORE_KEY)

class PostsStore {
  public extractionState: State = 'none'
  public posts: Post[] = []

  constructor() {
    if (storedPosts) {
      this.posts = (JSON.parse(storedPosts) as IPost[]).map((post) => new Post(this, post))
      this.extractionState = 'done'
    }

    makeAutoObservable(this, {
      loadPosts: flow,
    })
  }

  public *loadPosts(): Generator<Promise<IPost[]>, void, IPost[]> {
    this.extractionState = 'loading'

    try {
      const posts = yield extractPosts(rootStore.subreddit)

      localStorage.setItem(POSTS_STORE_KEY, JSON.stringify(posts))

      this.posts = posts.map((post) => new Post(this, post))
      this.extractionState = 'done'
    } catch (error) {
      this.extractionState = 'error'

      toast.error('Error loading posts', {
        action: {
          label: 'Retry',
          onClick: () => this.loadPosts(),
        },
      })
    }
  }

  public savePosts = () => {
    const updatedPosts = this.posts.map((p) => p.data)
    localStorage.setItem(POSTS_STORE_KEY, JSON.stringify(updatedPosts))
  }
}

export const postsStore = new PostsStore()
