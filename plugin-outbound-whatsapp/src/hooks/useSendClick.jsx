import { useContext } from 'react'
import { Actions } from '@twilio/flex-ui'

import { PanelContext } from '../contexts/contexts'

export const useSendClick = () => {
  const { toNumber, messageBody } = useContext(PanelContext)

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

  return { onSendClickHandler }
}
