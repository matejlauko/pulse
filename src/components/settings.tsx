import { rootStore, saveSettings } from '@/root-store'
import { observer } from 'mobx-react-lite'
import { toast } from 'sonner'
import styled from 'styled-components'
import { UIButton, UIContainer, UIInput } from './ui'

const Settings = observer(function Settings() {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.target as HTMLFormElement)
    const linearApiKey = data.get('linear-api-key')
    const anthropicApiKey = data.get('anthropic-api-key')

    if (!linearApiKey || !anthropicApiKey) {
      toast.error('Fill all settings')
      return
    }

    saveSettings({
      linearApiKey: linearApiKey as string,
      anthropicApiKey: anthropicApiKey as string,
    })
  }

  return (
    <SettingsContainer>
      <Title>Settings</Title>

      <Form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="linear-api-key">Linear API Key</label>
          <UIInput type="text" name="linear-api-key" defaultValue={rootStore.linearApiKey} />
        </div>

        <div>
          <label htmlFor="anthropic-api-key">Anthropic API Key</label>
          <UIInput type="text" name="anthropic-api-key" defaultValue={rootStore.anthropicApiKey} />
        </div>

        <UIButton type="submit">Save</UIButton>
      </Form>
    </SettingsContainer>
  )
})

export default Settings

const SettingsContainer = styled(UIContainer)`
  flex-direction: column;
  align-items: flex-start;
  padding-block: ${({ theme }) => theme.spacing[4]};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`

const Title = styled.h2`
  font-size: ${({ theme }) => theme.text['2xl']};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`
