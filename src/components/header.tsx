import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { UIContainer } from './ui'

const Header = observer(function Header() {
  return (
    <HeaderWrap>
      <HeaderContainer as="header">
        <Title>Pulse</Title>
      </HeaderContainer>
    </HeaderWrap>
  )
})

export default Header

const HeaderWrap = styled.div`
  height: 70px;
  background-color: ${({ theme }) => theme.colors.neutral[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[4]};
`

const HeaderContainer = styled(UIContainer)`
  height: 100%;
  align-items: center;
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.text.xl};
  font-weight: 700;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.blue[11]},
    ${({ theme }) => theme.colors.purple[11]}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
`
