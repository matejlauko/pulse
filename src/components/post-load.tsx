import linearSvg from '@/assets/linear.svg'
import type { Post } from '@/post'
import { usePrevious } from '@react-hookz/web'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { UIAnimatedCheck, UIAppearingBox, UIButton, UILoadingSpinner } from './ui'

interface Props {
  post: Post
}

const PostLoad = observer(function PostLoad({ post }: Props) {
  const { canLoad, loadedUrl, loadState } = post
  const prevLoadState = usePrevious<Post['loadState']>(loadState)

  const justLoaded = loadState === 'done' && prevLoadState === 'loading'
  const [shouldShowCheck, setShouldShowCheck] = useState(justLoaded)

  useEffect(() => {
    if (justLoaded) {
      setShouldShowCheck(true)
    }
  }, [justLoaded])

  useEffect(() => {
    if (shouldShowCheck) {
      setTimeout(() => {
        setShouldShowCheck(false)
      }, 3000)
    }
  }, [shouldShowCheck])

  const handleLoadClick = () => {
    post.load()
  }

  if (loadedUrl) {
    return (
      <UIAppearingBox appear={justLoaded}>
        <Wrap>
          {shouldShowCheck && <UIAnimatedCheck />}
          <LinearLink
            as="a"
            href={loadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open issue in Linear"
            aria-label="Open issue in Linear"
            $size="sm"
            $variant="secondary"
          >
            <SquareArrowOutUpRightIcon size={16} />
            <img src={linearSvg} alt="Linear" width="20px" height="20px" />
          </LinearLink>
        </Wrap>
      </UIAppearingBox>
    )
  }

  if (loadState === 'loading') return <UILoadingSpinner />

  if (canLoad)
    return (
      <UIButton $size="sm" onClick={handleLoadClick}>
        Push to <img src={linearSvg} alt="Linear" width="20px" height="20px" />
      </UIButton>
    )

  return null
})

export default PostLoad

const LinearLink = styled(UIButton)`
  padding-inline: ${({ theme }) => theme.spacing[2]};
`

const Wrap = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`
