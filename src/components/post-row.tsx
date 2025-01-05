import { decodeHTMLEntities } from '@/lib/utils'
import { ExternalLinkIcon } from 'lucide-react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import styled from 'styled-components'
import type { Post } from '../post'
import PostCategory from './post-category'
import PostInsight from './post-insight'
import PostLoad from './post-load'
import PostPriority from './post-priority'
import { UIButton } from './ui'

interface Props {
  post: Post
}

const PostRow = observer(function PostRow({ post }: Props) {
  useEffect(() => {
    autorun(() => {
      if (post.shouldCategorize) {
        post.categorize()
      }
      if (post.shouldExtractInsights) {
        post.extractInsights()
      }
    })
  }, [post])

  return (
    <>
      <TableCell>
        <PostTitleWrap>
          <PostTitle>{decodeHTMLEntities(post.title)}</PostTitle>
          <PostLinkButton
            as="a"
            href={post.sourceUrl}
            $size="sm"
            $variant="secondary"
            title="Open in Reddit"
            aria-label="Open in Reddit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLinkIcon size={16} />
          </PostLinkButton>
        </PostTitleWrap>
        <PostText>{decodeHTMLEntities(post.text)}</PostText>
      </TableCell>
      <TableCell>
        <PostCategory post={post} />
      </TableCell>
      <TableCell>
        <PostPriority post={post} />
      </TableCell>
      <TableCell>
        <PostInsight post={post} />
      </TableCell>
      <TableCell style={{ textAlign: 'right' }}>
        <AnimatePresence>
          <PostLoad post={post} />
        </AnimatePresence>
      </TableCell>
    </>
  )
})

export default PostRow

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[2]};
  box-shadow: inset 0 -1px 0 ${({ theme }) => theme.colors.neutral[6]};
  /* border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[6]}; */

  &:first-child {
    padding-inline-end: ${({ theme }) => theme.spacing[5]};
  }
`

const PostLinkButton = styled(UIButton)`
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing[1]};
  border: 0;
  height: ${({ theme }) => theme.spacing[5]};
`

const PostTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`

const PostTitle = styled.h3`
  font-weight: 600;
`

const PostText = styled.p`
  font-size: ${({ theme }) => theme.text.sm};
  margin-block-start: ${({ theme }) => theme.spacing[1]};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
`
