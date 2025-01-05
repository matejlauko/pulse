import { theme } from '@/styles/theme'
import { Disc3Icon } from 'lucide-react'
import { motion } from 'motion/react'
import type { ComponentProps } from 'react'
import styled, { css, keyframes } from 'styled-components'

export const UIContainer = styled.div`
  display: flex;
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.spacing[4]};
  width: 100%;
  max-width: 1400px;
`

const subtlePulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 ${theme.colors.blue[6]};
  }
  50% {
    box-shadow: 0 0 8px 4px ${theme.colors.blue[5]};
  }
  100% {
    box-shadow: 0 0 0 0 ${theme.colors.blue[6]};
  }
`

const pulseAnimation = css`
  animation: ${subtlePulse} 1.5s infinite ease-in-out;
  transform-origin: center;
  will-change: transform;

  &:hover {
    animation: none;
  }
`

export const UIButton = styled.button<{
  $pulse?: boolean
  $size?: 'sm' | 'md' | 'lg'
  $variant?: 'primary' | 'secondary'
}>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  transition: all 0.1s ease-out;
  font-weight: 600;
  line-height: 1;

  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${({ theme }) => theme.colors.neutral[12]};
          color: ${({ theme }) => theme.colors.neutral[1]};
        `
      case 'secondary':
        return css`
          background-color: ${({ theme }) => theme.colors.neutral[2]};
          border-width: 1px;
          border-color: ${({ theme }) => theme.colors.neutral[6]};
          color: ${({ theme }) => theme.colors.neutral[12]};
        `
    }
  }}

  ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding-inline: ${({ theme }) => theme.spacing[3]};
          height: ${({ theme }) => theme.spacing[7]};
          font-size: ${({ theme }) => theme.text.sm};
          border-radius: ${({ theme }) => theme.borderRadius.sm};
        `
      case 'md':
        return css`
          padding-inline: ${({ theme }) => theme.spacing[4]};
          height: ${({ theme }) => theme.spacing[9]};
          font-size: ${({ theme }) => theme.text.base};
          border-radius: ${({ theme }) => theme.borderRadius.base};
        `
      case 'lg':
        return css`
          padding-inline: ${({ theme }) => theme.spacing[6]};
          height: ${({ theme }) => theme.spacing[11]};
          font-size: ${({ theme }) => theme.text['lg']};
          border-radius: ${({ theme }) => theme.borderRadius.base};
        `
    }
  }}

  ${({ $pulse }) => $pulse && pulseAnimation}

  &:hover {
    box-shadow: 0 0 4px 2px ${({ theme }) => theme.colors.blackAlpha[5]};
  }

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
`

export const UILabel = styled.div<{
  $color: 'purple' | 'blue' | 'green' | 'orange' | 'yellow' | 'red'
}>`
  display: inline-flex;
  font-size: ${({ theme }) => theme.text.sm};
  font-weight: 600;
  border-radius: 0.35rem;
  padding: 4px 6px;
  border-width: 1px;
  border-color: ${({ theme, $color }) => theme.colors[$color][5]};
  background-color: ${({ theme, $color }) => theme.colors[$color][2]};
  color: ${({ theme, $color }) => theme.colors[$color][11]};
  line-height: 1;
`

const UIAnimatedSpinner = motion.create(styled(Disc3Icon)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.neutral[11]};
  display: inline-block;
`)

export const UILoadingSpinner = () => {
  return (
    <UIAnimatedSpinner
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.1 }}
    />
  )
}

export const UIAppearingBox = ({
  appear,
  ...props
}: { appear: boolean } & ComponentProps<typeof motion.div>) => {
  return (
    <motion.div
      initial={
        appear
          ? {
              opacity: 0.2,
              x: 10,
            }
          : false
      }
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        ease: 'easeOut',
        duration: 0.15,
        opacity: {
          delay: 0.05,
        },
      }}
      {...props}
    />
  )
}

export const UIAnimatedCheck = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--green-9)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M4 12l5 5 11-11"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
          transition: {
            pathLength: { type: 'spring', duration: 2, bounce: 0 },
            opacity: { duration: 0.01 },
          },
        }}
      />
    </motion.svg>
  )
}

export const UIInput = styled.input`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[7]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`
