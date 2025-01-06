import { postsStore } from '@/posts'
import { observer } from 'mobx-react-lite'
import { motion } from 'motion/react'
import styled, { keyframes } from 'styled-components'
import PostRow from './post-row'
import { UIContainer } from './ui'

const PostsList = observer(function PostsList() {
  const { posts, sortedPosts } = postsStore

  return (
    <PostsListContainer>
      <Table>
        <thead>
          <tr>
            <TableHeadCell>Post</TableHeadCell>
            <TableHeadCell style={{ width: '140px' }}>Category</TableHeadCell>
            <TableHeadCell style={{ width: '100px' }}>Priority</TableHeadCell>
            <TableHeadCell style={{ width: '320px' }}>Insight</TableHeadCell>
            <TableHeadCell style={{ width: '120px' }} />
          </tr>
        </thead>

        <motion.tbody
          variants={{}}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.05 }}
        >
          {sortedPosts.map((post) => (
            <motion.tr
              key={post.id}
              variants={rowVariants}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <PostRow post={post} />
            </motion.tr>
          ))}

          {posts.length === 0 && (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  <LoadingCellSkeleton $idx={index} colSpan={5} />
                </tr>
              ))}
            </>
          )}
        </motion.tbody>
      </Table>
    </PostsListContainer>
  )
})

export default PostsList

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

const PostsListContainer = styled(UIContainer)`
  padding-block: ${({ theme }) => theme.spacing[4]};
`

const Table = styled.table`
  width: 100%;
  text-align: left;
`

const TableHeadCell = styled.th`
  padding: ${({ theme }) => theme.spacing[2]};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.neutral[11]};
  font-size: ${({ theme }) => theme.text.sm};

  &:first-child {
    padding-inline-end: ${({ theme }) => theme.spacing[5]};
  }
`

const pulse = keyframes`
  50% {
    opacity: 1;
  }
`

const LoadingCellSkeleton = styled.td<{ $idx: number }>`
  height: ${({ theme }) => theme.spacing[10]};
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: ${({ theme }) => theme.spacing[2]};
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.neutral[3]};
    opacity: 0.3;
    animation: ${pulse} 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
    animation-delay: ${({ $idx }) => $idx * 0.1}s;
  }
`
