import React, { useState } from 'react'
import { Actions, Manager, useFlexSelector } from '@twilio/flex-ui'
import { Theme } from '@twilio-paste/theme'
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon'

import {
  Container,
  StyledSidePanel,
  OfflineContainer
} from './OutboundWAPanel.styles'
import { DialerComponent } from '../DialerComponent/DialerComponent'
import { MessageComponent } from '../MessageComponent/MessageComponent'
import { PanelContext } from '../../contexts/contexts'
import { templates } from '../../utils/templates'

// IMPORTANT: This is just a simple example on how to add templates in your Select options.

export const OutboundWAPanel = props => {
  const [toNumber, setToNumber] = useState('+55')
  const [messageBody, setMessageBody] = useState(templates[0])

  // Redux state
  const isOutboundWAPanelOpen = useFlexSelector(
    state =>
      state.flex.view.componentViewStates?.outboundWAPanel
        ?.isOutboundWAPanelOpen
  )
  const worker = useFlexSelector(state => state.flex.worker)

  // worker availability checks
  const { taskrouter_offline_activity_sid } =
    Manager.getInstance().serviceConfiguration

  const isWorkerAvailable =
    worker.activity?.sid !== taskrouter_offline_activity_sid

  // event handlers
  const handleClose = () => {
    Actions.invokeAction('ToggleOutboundWAPanel')
  }

  // const onSendClickHandler = menuItemClicked => {
  //   // default is open a chat task which would have had the message added
  //   let payload = {
  //     destination: toNumber,
  //     body: messageBody,
  //     openChat: true,
  //     routeToMe: true
  //   }

  //   // defer opening a task until customer replies
  //   switch (menuItemClicked) {
  //     case 'SEND_MESSAGE_REPLY_ME':
  //       payload.openChat = false
  //       payload.routeToMe = true
  //       break

  //     case 'SEND_MESSAGE':
  //       payload.openChat = false
  //       payload.routeToMe = false
  //       break
  //   }

  //   Actions.invokeAction('SendOutboundWA', payload)
  //   Actions.invokeAction('ToggleOutboundWAPanel')
  // }

  // if we navigate away clear state
  if (!isOutboundWAPanelOpen) {
    if (toNumber !== '+55') setToNumber('+55')
    return null
  }

  return (
    <Theme.Provider theme='default'>
      <Container>
        <StyledSidePanel
          displayName='WhatsApp'
          themeOverride={props.theme && props.theme.OutboundDialerPanel}
          handleCloseClick={handleClose}
          title='WhatsApp'
        >
          {isWorkerAvailable && (
            <PanelContext.Provider
              value={{
                theme: props.theme,
                toNumber,
                messageBody,
                setToNumber,
                messageBody,
                setMessageBody
              }}
            >
              <DialerComponent />
              <MessageComponent />
            </PanelContext.Provider>
          )}
          {!isWorkerAvailable && (
            <OfflineContainer theme={props.theme}>
              <ErrorIcon decorative title='Error' />
              {`To send a message, please change your status from ${worker.activity.name}`}
            </OfflineContainer>
          )}
        </StyledSidePanel>
      </Container>
    </Theme.Provider>
  )
}
