import React from 'react'
import styled from 'styled-components'
import { Actions, Manager, IconButton } from '@twilio/flex-ui'
import { connect } from 'react-redux'

function onCloseClick(actionType) {
  Actions.invokeAction(actionType)
}

function isOutboundCallingEnabled() {
  const { outbound_call_flows: flows } =
    Manager.getInstance().serviceConfiguration
  return Boolean(flows && flows.default && flows.default.enabled)
}

const StyledIconButton = styled(IconButton)`
  margin-right: ${props => props.theme.tokens.spacings.space30};
  &:focus-visible {
    border-color: ${props =>
      props.theme.tokens.borderColors.colorBorderInverse};
  }
`

const OutboundPanelButton = props => {
  const {
    isOutboundDialerOpen,
    isOutboundWAPanelOpen,
    outboundPanelType,
    isLiveVoiceCall,
    hasIncomingCallReservation
  } = props

  let icon = 'Dialpad'
  let disabled =
    isLiveVoiceCall || hasIncomingCallReservation || isOutboundWAPanelOpen
  let actionType = 'ToggleOutboundDialer'

  if (outboundPanelType === 'voice' && !isOutboundCallingEnabled()) return null

  if (outboundPanelType === 'wa') {
    icon = 'Whatsapp'
    disabled = isOutboundDialerOpen
    actionType = 'ToggleOutboundWAPanel'
  }

  return (
    <StyledIconButton
      theme={props.theme}
      key={outboundPanelType}
      icon={icon}
      onClick={() => onCloseClick(actionType)}
      size='small'
      disabled={disabled}
    />
  )
}

const mapStateToProps = state => {
  const isOutboundDialerOpen = state.flex.view.isOutboundDialerOpen
  const isOutboundWAPanelOpen =
    state.flex.view.componentViewStates?.outboundWAPanel?.isOutboundWAPanelOpen
  return { isOutboundDialerOpen, isOutboundWAPanelOpen }
}

export default connect(mapStateToProps)(OutboundPanelButton)
