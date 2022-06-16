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
