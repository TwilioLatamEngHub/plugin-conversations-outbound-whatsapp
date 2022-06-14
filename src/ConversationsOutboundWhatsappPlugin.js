import React from 'react'
import { FlexPlugin } from '@twilio/flex-plugin'

import OutboundPanelButton from './components/OutboundPanelButton'
import { OutboundWAPanel } from './components/OutboundWAPanel/OutboundWAPanel'
import { registerNotifications } from './utils/notifications'
import './actions'

const PLUGIN_NAME = 'ConversationsOutboundWhatsappPlugin'

export default class ConversationsOutboundWhatsappPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME)
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    registerNotifications(manager)

    flex.MainContainer.Content.add(<OutboundWAPanel key='outbound-wa-panel' />)

    flex.MainHeader.Content.remove('dialpad-button')

    flex.MainHeader.Content.add(
      <OutboundPanelButton
        outboundPanelType='voice'
        key='voice-dialpad-button'
      />,
      { sortOrder: 1, align: 'end' }
    )

    flex.MainHeader.Content.add(
      <OutboundPanelButton outboundPanelType='wa' key='wa-dialpad-button' />,
      { sortOrder: 0, align: 'end' }
    )
  }
}
