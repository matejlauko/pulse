import type { Category } from '@/modules/transform/categorize'
import type { Post } from '@/post'
import { usePrevious } from '@react-hookz/web'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UIAppearingBox, UILabel, UILoadingSpinner } from './ui'

interface Props {
  post: Post
}

const CATEGORY_COLOR = {
  bug: 'red',
  request: 'blue',
  question: 'orange',
  other: 'yellow',
} as const satisfies Record<Category, string>

const PostCategory = observer(function PostCategory({ post }: Props) {
  const { category, categorizationState } = post
  const prevCategoryState = usePrevious<Post['category']>(category)

  if (category) {
    const justLoaded = prevCategoryState !== category

    return (
      <UIAppearingBox appear={justLoaded}>
        <CategoryLabel $color={CATEGORY_COLOR[category]}>{category}</CategoryLabel>
      </UIAppearingBox>
    )
  }

  if (categorizationState === 'loading') {
    return <UILoadingSpinner />
  }

  return null
})

export default PostCategory

const CategoryLabel = styled(UILabel)`
  text-transform: capitalize;
`
