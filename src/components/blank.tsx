import { postsStore } from '@/posts'
import { rootStore, saveSubreddit } from '@/root-store'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'
import styled from 'styled-components'
import { UIButton, UIContainer, UIInput } from './ui'

const Blank = observer(function Blank() {
  const inputRef = useRef<HTMLInputElement>(null)
  const handleExtractClick = () => {
    if (!inputRef.current) return

    saveSubreddit(inputRef.current.value)
    postsStore.loadPosts()
  }

  return (
    <BlankContainer>
      <BlankTitle>
        Extract posts from <UIInput type="text" defaultValue={rootStore.subreddit} ref={inputRef} />{' '}
        subreddit
      </BlankTitle>
      <UIButton $pulse $size="lg" onClick={handleExtractClick}>
        Extract posts
      </UIButton>
    </BlankContainer>
  )
})

export default Blank

const BlankContainer = styled(UIContainer)`
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  padding-block: ${({ theme }) => theme.spacing[4]};
`

const BlankTitle = styled.h2`
  font-size: ${({ theme }) => theme.text['2xl']};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`
