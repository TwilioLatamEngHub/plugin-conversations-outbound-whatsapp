import styled from 'styled-components'
import { SidePanel } from '@twilio/flex-ui'

export const StyledSidePanel = styled(SidePanel)`
  width: 276px;
`

export const Container = styled('div')`
  display: flex;
  position: absolute;
  height: 100%;
  right: 0px;
  z-index: 10;
`

export const Caption = styled('label')`
  display: block;
  font-size: ${p => p.theme.tokens.fontSizes.fontSize30};
  line-height: 1.6;
  font-weight: ${p => p.theme.tokens.fontWeights.fontWeightSemibold};
  margin-top: ${p => p.theme.tokens.spacings.space50};
  margin-bottom: ${p => p.theme.tokens.spacings.space20};
  width: 100%;
`

export const DialerContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 276px;
  padding: 0 ${p => p.theme.tokens.spacings.space50};
  box-sizing: border-box;
  opacity: ${({ disabled }) => disabled && 0.4};
  ${({ disabled, theme }) =>
    disabled && theme.OutboundDialerPanel.Container.disabled};

  & > div > div > button {
    color: #0263e0;
  }
`

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

export const OfflineContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 276px;
  padding: 0 ${p => p.theme.tokens.spacings.space50} 80px;
  box-sizing: border-box;
  flex-grow: 1;
  text-align: center;
`
