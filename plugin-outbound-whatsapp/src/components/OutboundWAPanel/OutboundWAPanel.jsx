import React, { useState } from 'react'
import { Actions, Dialer, Manager, useFlexSelector } from '@twilio/flex-ui'
import {
  TextArea,
  MenuButton,
  MenuItem,
  Menu,
  MenuSeparator,
  useMenuState
} from '@twilio-paste/core'
import { Theme } from '@twilio-paste/theme'
import { ChevronDownIcon } from '@twilio-paste/icons/esm/ChevronDownIcon'
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon'
import { PhoneNumberUtil } from 'google-libphonenumber'

import {
  Container,
  StyledSidePanel,
  Caption,
  DialerContainer,
  MessageContainer,
  SendMessageContainer,
  OfflineContainer
} from './OutboundWAPanel.styles'

const SendMessageMenu = props => {
  const menu = useMenuState()
  return (
    <>
      <MenuButton {...menu} variant='primary' disabled={props.disableSend}>
        Send message.... <ChevronDownIcon decorative />
      </MenuButton>
      <Menu {...menu} aria-label='Actions'>
        <MenuItem {...menu} onClick={() => props.onClickHandler('OPEN_CHAT')}>
          ....and open chat with customer
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          {...menu}
          onClick={() => props.onClickHandler('SEND_MESSAGE_REPLY_ME')}
        >
          ....and open chat with customer when they reply (route reply to me)
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          {...menu}
          onClick={() => props.onClickHandler('SEND_MESSAGE')}
        >
          ....and open chat with customer when they reply (route reply to any
          agent)
        </MenuItem>
      </Menu>
    </>
  )
}

export const OutboundWAPanel = props => {
  const [toNumber, setToNumber] = useState('+55')
  const [messageBody, setMessageBody] = useState('')

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

  // valid phone number and message so OK to enable send button?
  let disableSend = true
  const phoneUtil = PhoneNumberUtil.getInstance()
  try {
    const parsedToNumber = phoneUtil.parse(toNumber)

    if (phoneUtil.isPossibleNumber(parsedToNumber) && messageBody.length)
      if (phoneUtil.isValidNumber(parsedToNumber)) disableSend = false
  } catch (error) {}

  // event handlers
  const handleClose = () => {
    Actions.invokeAction('ToggleOutboundWAPanel')
  }

  const onSendClickHandler = menuItemClicked => {
    // default is open a chat task which would have had the message added
    let payload = {
      destination: toNumber,
      body: messageBody,
      openChat: true,
      routeToMe: true
    }

    // defer opening a task until customer replies
    switch (menuItemClicked) {
      case 'SEND_MESSAGE_REPLY_ME':
        payload.openChat = false
        payload.routeToMe = true
        break

      case 'SEND_MESSAGE':
        payload.openChat = false
        payload.routeToMe = false
        break
    }

    Actions.invokeAction('SendOutboundWA', payload)
    Actions.invokeAction('ToggleOutboundWAPanel')
  }

  // if we navigate away clear state
  if (!isOutboundWAPanelOpen) {
    if (toNumber !== '+55') setToNumber('+55')
    if (messageBody.length) setMessageBody('')
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
            <>
              <DialerContainer theme={props.theme}>
                <Caption
                  key='wa-outbound-input'
                  htmlFor='dwa-outbound-input'
                  theme={props.theme}
                >
                  Enter a number
                </Caption>
                <Dialer
                  key='dialer'
                  onDial={setToNumber}
                  defaultPhoneNumber={toNumber}
                  onPhoneNumberChange={setToNumber}
                  hideActions
                  disabled={false}
                  defaultCountryAlpha2Code={'BR'}
                />
              </DialerContainer>
              <MessageContainer theme={props.theme}>
                <TextArea
                  theme={props.themes}
                  onChange={event => {
                    setMessageBody(event.target.value)
                  }}
                  id='wa-body'
                  name='wa-body'
                  placeholder='Type message'
                />
                <SendMessageContainer theme={props.theme}>
                  <SendMessageMenu
                    disableSend={disableSend}
                    onClickHandler={onSendClickHandler}
                  />
                </SendMessageContainer>
              </MessageContainer>
            </>
          )}
          {!isWorkerAvailable && (
            <OfflineContainer theme={props.theme}>
              <ErrorIcon />
              {`To send a message, please change your status from ${worker.activity.name}`}
            </OfflineContainer>
          )}
        </StyledSidePanel>
      </Container>
    </Theme.Provider>
  )
}
