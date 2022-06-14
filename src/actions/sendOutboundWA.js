import { Actions, Manager, Notifications } from '@twilio/flex-ui'
const manager = Manager.getInstance()

const sendOutboundWA = async (
  OpenChatFlag,
  KnownAgentRoutingFlag,
  To,
  From,
  Body,
  WorkerSid,
  WorkerFriendlyName,
  WorkspaceSid,
  WorkflowSid,
  QueueSid,
  InboundStudioFlow
) => {
  const body = {
    OpenChatFlag,
    KnownAgentRoutingFlag,
    To,
    From,
    Body,
    WorkspaceSid,
    WorkflowSid,
    QueueSid,
    WorkerSid,
    WorkerFriendlyName,
    InboundStudioFlow,
    Token: manager.store.getState().flex.session.ssoTokenPayload.token
  }

  console.log('DEBUG body', body)

  const options = {
    method: 'POST',
    body: new URLSearchParams(body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  }

  try {
    const resp = await fetch(
      `${process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN}`,
      options
    )
    const data = await resp.json()

    if (!OpenChatFlag && data.success) {
      Notifications.showNotification('outboundWASent', {
        message: To
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
    sendOutboundWA(
      true,
      false,
      payload.destination,
      process.env.FLEX_APP_TWILIO_FROM_NUMBER,
      payload.body,
      manager.workerClient.sid,
      manager.user.identity,
      process.env.FLEX_APP_WORKSPACE_SID,
      process.env.FLEX_APP_WORKFLOW_SID,
      process.env.FLEX_APP_QUEUE_SID,
      ''
    )
  } else {
    // send message and inbound triggers studio flow. optional known agent routing
    sendOutboundWA(
      false,
      !!payload.routeToMe,
      payload.destination,
      process.env.FLEX_APP_TWILIO_FROM_NUMBER,
      payload.body,
      manager.workerClient.sid,
      manager.user.identity,
      '',
      '',
      '',
      process.env.FLEX_APP_INBOUND_STUDIO_FLOW
    )
  }
})
