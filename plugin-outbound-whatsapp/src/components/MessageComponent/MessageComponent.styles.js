import styled from 'styled-components'

export const MessageContainer = styled('div')`
  padding: ${p => p.theme.tokens.spacings.space50};
  color: #121c2d;
`

export const SendMessageContainer = styled('div')`
  padding: ${p => p.theme.tokens.spacings.space50} 0;

  & > button {
    width: 100%;
  }
`
