import { Notifications, NotificationType } from '@twilio/flex-ui'

const registerOutboundWAFailed = manager => {
  manager.strings.outboundWAFailed = 'Outbound WhatsApp failed: "{{message}}"'
  Notifications.registerNotification({
    id: 'outboundWAFailed',
    content: 'outboundWAFailed', // template
    closeButton: false,
    timeout: 3000,
    type: NotificationType.error
  })
}

const registerOutboundWASent = manager => {
  manager.strings.outboundWASent = 'WhatsApp sent to "{{message}}"'
  Notifications.registerNotification({
    id: 'outboundWASent',
    content: 'outboundWASent', // template
    timeout: 3000,
    type: NotificationType.success
  })
}

export const registerNotifications = manager => {
  registerOutboundWAFailed(manager)
  registerOutboundWASent(manager)
}
