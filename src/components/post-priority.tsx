import type { Priority } from '@/modules/transform/insights'
import type { Post } from '@/post'
import { usePrevious } from '@react-hookz/web'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UIAppearingBox, UILabel, UILoadingSpinner } from './ui'

interface Props {
  post: Post
}

const PRIORITY_COLOR = {
  urgent: 'red',
  high: 'orange',
  normal: 'blue',
  low: 'green',
} as const satisfies Record<Priority, string>

const PostPriority = observer(function PostPriority({ post }: Props) {
  const { priority, insightState } = post
  const prevPriorityState = usePrevious<Post['priority']>(priority)

  if (priority) {
    const justLoaded = prevPriorityState !== priority

    return (
      <UIAppearingBox appear={justLoaded}>
        <PriorityLabel $color={PRIORITY_COLOR[priority]}>{priority}</PriorityLabel>
      </UIAppearingBox>
    )
  }

  if (insightState === 'loading') {
    return <UILoadingSpinner />
  }

  return null
})

export default PostPriority

const PriorityLabel = styled(UILabel)`
  text-transform: capitalize;
`
