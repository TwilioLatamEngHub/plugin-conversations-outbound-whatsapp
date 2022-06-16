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

export const OutboundWAPanel = ({ theme }) => {
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
          themeOverride={theme && theme.OutboundDialerPanel}
          handleCloseClick={handleClose}
          title='WhatsApp'
        >
          {isWorkerAvailable && (
            <PanelContext.Provider
              value={{
                theme: theme,
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
            <OfflineContainer theme={theme}>
              <ErrorIcon decorative title='Error' />
              {`To send a message, please change your status from ${worker.activity.name}`}
            </OfflineContainer>
          )}
        </StyledSidePanel>
      </Container>
    </Theme.Provider>
  )
}
