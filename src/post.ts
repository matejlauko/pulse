import { flow, makeAutoObservable } from 'mobx'
import { toast } from 'sonner'
import { loadIssue, type LoadIssueResult } from './modules/load/load'
import { categorizePost, type Category } from './modules/transform/categorize'
import {
  extractInsights,
  type ExtractInsightsResult,
  type Priority,
} from './modules/transform/insights'
import type { postsStore as PostsStore } from './posts'

type PostSource = 'reddit'
type State = 'none' | 'loading' | 'error' | 'done'

export interface IPost {
  id: string
  title: string
  text: string
  authorName: string
  source: PostSource
  sourceCreatedAt: string
  sourceUrl: string
  sourceId: string
  category?: Category | null
  insight?: string | null
  priority?: Priority | null
  loadedUrl?: string | null
}

export interface IPostWithCategory extends IPost {
  category: Category
}

export interface IPostWithInsights extends IPostWithCategory {
  insight: string
  priority: Priority
}

export class Post implements IPost {
  public id: string
  public title: string
  public text: string
  public authorName: string
  public source: PostSource
  public sourceCreatedAt: string
  public sourceUrl: string
  public sourceId: string

  public category?: Category | null
  public categorizationState: State = 'none'

  public insight?: string | null
  public priority?: Priority | null
  public insightState: State = 'none'

  public loadedUrl?: string | null
  public loadState: State = 'none'

  constructor(
    private postsStore: typeof PostsStore,
    data: IPost
  ) {
    this.id = data.id
    this.title = data.title
    this.text = data.text
    this.authorName = data.authorName
    this.source = data.source
    this.sourceCreatedAt = data.sourceCreatedAt
    this.sourceUrl = data.sourceUrl
    this.sourceId = data.sourceId

    this.category = data.category
    this.categorizationState = data.category ? 'done' : 'none'

    this.insight = data.insight
    this.priority = data.priority
    this.insightState = data.insight ? 'done' : 'none'

    this.loadedUrl = data.loadedUrl
    this.loadState = data.loadedUrl ? 'done' : 'none'

    makeAutoObservable<Post, 'posts'>(this, {
      categorize: flow,
      posts: false,
    })
  }

  get data() {
    return {
      id: this.id,
      title: this.title,
      text: this.text,
      authorName: this.authorName,
      source: this.source,
      sourceCreatedAt: this.sourceCreatedAt,
      sourceUrl: this.sourceUrl,
      sourceId: this.sourceId,
      category: this.category,
      insight: this.insight,
      priority: this.priority,
      loadedUrl: this.loadedUrl,
    }
  }

  hasCategory(): this is IPostWithCategory {
    return this.category !== undefined
  }

  hasInsight(): this is IPostWithInsights {
    return this.insight !== undefined
  }

  get shouldCategorize(): boolean {
    return this.categorizationState === 'none' && !this.category
  }

  get shouldExtractInsights(): boolean {
    return (
      this.insightState === 'none' &&
      !this.insight &&
      !this.priority &&
      this.hasCategory() &&
      ['bug', 'request'].includes(this.category)
    )
  }

  get canLoad(): boolean {
    return this.hasCategory() && this.hasInsight()
  }

  /**
   * Save post to local storage after any changes -- must save all posts
   */

  /**
   * Assigns category to the post using AI
   */
  *categorize(): Generator<Promise<Category>, void, Category> {
    this.categorizationState = 'loading'

    try {
      const resPosts = yield categorizePost(this)

      this.category = resPosts
      this.categorizationState = 'done'
    } catch (error) {
      this.categorizationState = 'error'

      toast.error('Error categorizing post', {
        action: {
          label: 'Retry',
          onClick: () => this.categorize(),
        },
      })
    }

    this.save()
  }

  /**
   * Extracts insights from the post using AI
   */
  *extractInsights(): Generator<Promise<ExtractInsightsResult>, void, ExtractInsightsResult> {
    this.insightState = 'loading'

    try {
      if (!this.hasCategory()) {
        throw new Error('Post has no category')
      }

      const resPosts = yield extractInsights(this)

      this.insight = resPosts.insight
      this.priority = resPosts.priority
      this.insightState = 'done'
    } catch (error) {
      this.insightState = 'error'

      toast.error('Error extracting insight', {
        action: {
          label: 'Retry',
          onClick: () => this.extractInsights(),
        },
      })
    }

    this.save()
  }

  /**
   * Load the post as Linear issue
   */
  *load(): Generator<Promise<LoadIssueResult>, void, LoadIssueResult> {
    this.loadState = 'loading'

    try {
      if (!this.hasCategory() || !this.hasInsight()) {
        throw new Error('Post has no category or insight')
      }

      const resPosts = yield loadIssue(this)

      this.loadedUrl = resPosts.url
      this.loadState = 'done'
    } catch (error) {
      this.loadState = 'error'

      toast.error('Error loading post', {
        action: {
          label: 'Retry',
          onClick: () => this.load(),
        },
      })
    }

    this.save()
  }

  private save = () => {
    this.postsStore.savePosts()
  }
}
