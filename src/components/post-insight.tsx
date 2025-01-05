import type { Post } from '@/post'
import { usePrevious } from '@react-hookz/web'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UIAppearingBox, UILoadingSpinner } from './ui'

interface Props {
  post: Post
}

const PostInsight = observer(function PostInsight({ post }: Props) {
  const { insight, insightState } = post
  const prevInsightState = usePrevious<Post['insightState']>(insightState)

  if (insight) {
    const justLoaded = prevInsightState !== insightState

    return (
      <UIAppearingBox appear={justLoaded}>
        <Insight>{insight}</Insight>
      </UIAppearingBox>
    )
  }

  if (insightState === 'loading') {
    return <UILoadingSpinner />
  }

  return null
})

export default PostInsight

const Insight = styled.p`
  font-weight: 500;
  line-height: 1.3;
  font-size: ${({ theme }) => theme.text.sm};
`
