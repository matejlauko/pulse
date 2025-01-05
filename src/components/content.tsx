import { postsStore } from '@/posts'
import { rootStore } from '@/root-store'
import { observer } from 'mobx-react-lite'
import Blank from './blank'
import PostsList from './posts-list'
import Settings from './settings'

const Content = observer(function Content() {
  const { extractionState } = postsStore
  const { linearApiKey, anthropicApiKey } = rootStore

  if (!linearApiKey || !anthropicApiKey) {
    return <Settings />
  }

  if (extractionState === 'none') {
    return <Blank />
  }

  return <PostsList />
})

export default Content
