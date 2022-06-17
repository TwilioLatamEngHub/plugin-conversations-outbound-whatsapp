import { Actions, Manager, Notifications } from '@twilio/flex-ui'
const manager = Manager.getInstance()

const sendOutboundWA = async sendOutboundParams => {
  const body = {
    ...sendOutboundParams,
    Token: manager.store.getState().flex.session.ssoTokenPayload.token
  }

  console.log('DEBUG body', body)

  try {
    const resp = await fetch(
      `${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
      }
    )

    const data = await resp.json()

    if (!body.OpenChatFlag && data.success) {
      Notifications.showNotification('outboundWASent', {
        message: body.To
      })
    }

    if (!data.success) {
      Notifications.showNotification('outboundWAFailed', {
        message: data.errorMessage
      })
    }
  } catch (error) {
    console.error(error)
    Notifications.showNotification('outboundWAFailed', {
      message: 'Error calling sendOutboundWA function'
    })
  }
}

// TODO - fallback and try and use outbound calling setup sids
// TODO - allow override of from number and queue from action payload
Actions.registerAction('SendOutboundWA', payload => {
  if (payload.openChat) {
    // create a task immediately
    const sendOutboundParams = {
      OpenChatFlag: true,
      KnownAgentRoutingFlag: false,
      To: payload.destination,
      From: process.env.FLEX_APP_TWILIO_FROM_NUMBER,
      Body: payload.body,
      WorkerSid: manager.workerClient.sid,
      WorkerFriendlyName: manager.user.identity,
      WorkspaceSid: process.env.FLEX_APP_WORKSPACE_SID,
      WorkflowSid: process.env.FLEX_APP_WORKFLOW_SID,
      QueueSid: process.env.FLEX_APP_QUEUE_SID,
      InboundStudioFlow: process.env.FLEX_APP_INBOUND_STUDIO_FLOW
    }
    sendOutboundWA(sendOutboundParams)
  } else {
    // send message and inbound triggers studio flow. optional known agent routing
    const sendOutboundParams = {
      OpenChatFlag: false,
      KnownAgentRoutingFlag: !!payload.routeToMe,
      To: payload.destination,
      From: process.env.FLEX_APP_TWILIO_FROM_NUMBER,
      Body: payload.body,
      WorkerSid: manager.workerClient.sid,
      WorkerFriendlyName: manager.user.identity,
      WorkspaceSid: '',
      WorkflowSid: '',
      QueueSid: '',
      InboundStudioFlow: process.env.FLEX_APP_INBOUND_STUDIO_FLOW
    }
    sendOutboundWA(sendOutboundParams)
  }
})
