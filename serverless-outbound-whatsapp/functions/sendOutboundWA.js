const TokenValidator = require('twilio-flex-token-validator').functionValidator

// Create a flex interaction that targets the agent with a task and add in a message to the conversation
const openAChatTask = async (
  client,
  To,
  From,
  Body,
  WorkerFriendlyName,
  routingProperties
) => {
  const interaction = await client.flexApi.v1.interaction.create({
    channel: {
      type: 'whatsapp',
      initiated_by: 'agent',
      properties: {
        type: 'whatsapp'
      },
      participants: [
        {
          address: `whatsapp:${To}`,
          proxy_address: `whatsapp:${From}`
        }
      ]
    },
    routing: {
      properties: {
        ...routingProperties,
        task_channel_unique_name: 'Chat',
        attributes: {
          from: To,
          direction: 'outbound',
          customerName: 'Customer',
          customerAddress: `whatsapp:${To}`,
          twilioNumber: `whatsapp:${From}`,
          channelType: 'whatsapp'
        }
      }
    }
  })

  const taskAttributes = JSON.parse(interaction.routing.properties.attributes)

  await client.conversations
    .conversations(taskAttributes.conversationSid)
    .messages.create({ author: WorkerFriendlyName, body: Body })

  return {
    success: true,
    interactionSid: interaction.sid,
    conversationSid: taskAttributes.conversationSid
  }
}

const fetchPreviousConversations = async (client, To) => {

  // const resUserConversations = await axios.get(`https://conversations.twilio.com/v1/ParticipantConversations?Address=whatsapp:${To}`, {
  //   headers: {
  //     Authorization: `Basic ${Buffer.from(`${process.env.ACCOUNT_SID}:${process.env.AUTH_TOKEN}`, 'utf8').toString('base64')}`
  //   }
  // });
  console.log("Fetching user conversation address ", `whatsapp:${To}`)
  try {
    const userConversations = await client.conversations.v1.participantConversations
      .list({ address: `whatsapp:${To}` });

    const openConversation = userConversations.find(conv => conv.conversationState === "active");

    return openConversation

  } catch (e) {
    console.error(e)
    return {}
  }
}


const unparkInteraction = async (client, conversation, routingProperties) => {

  const attributes = JSON.parse(conversation.conversationAttributes)

  const { interactionSid, channelSid, taskAttributes, taskChannelUniqueName, webhookSid } = attributes

  // Remove webhook so it doesn't keep triggering if parked more than once
  if (webhookSid && interactionSid) {
    await client.conversations
      .conversations(conversation.conversationSid)
      .webhooks(webhookSid)
      .remove()

    // Create a new task through the invites endpoint
    console.log({
      ...routingProperties,
      task_channel_unique_name: taskChannelUniqueName,
      attributes: taskAttributes
    })
    await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .invites.create({
        routing: {
          properties: {
            ...routingProperties,
            task_channel_unique_name: taskChannelUniqueName,
            attributes: taskAttributes
          }
        }
      })
    return {
      success: true,
      interactionSid: interactionSid,
      conversationSid: conversation.conversationSid
    }
  }
  return {
    success: false,
    conversationSid: conversation.conversationSid
  }
}
const sendOutboundMessage = async (
  client,
  To,
  From,
  Body,
  KnownAgentRoutingFlag,
  WorkerFriendlyName,
  InboundStudioFlow, PreviousConversation
) => {
  const friendlyName = `Outbound ${From} -> ${To}`

  // Set flag in channel attribtues so Studio knows if it should set task attribute to target known agent
  let converstationAttributes = { KnownAgentRoutingFlag }
  if (KnownAgentRoutingFlag)
    converstationAttributes.KnownAgentWorkerFriendlyName = WorkerFriendlyName
  const attributes = JSON.stringify(converstationAttributes)

  let channel = {}

  // Create Channel
  if (PreviousConversation == null) {
    channel = await client.conversations.conversations.create({
      friendlyName,
      attributes
    })
    try {
      // Add customer to channel
      await client.conversations.conversations(channel.sid).participants.create({
        'messagingBinding.address': `whatsapp:${To}`,
        'messagingBinding.proxyAddress': `whatsapp:${From}`
      })
    } catch (error) {
      console.log(error)

      if (error.code === 50416) {
        return {
          success: false,
          errorMessage: `Error sending message. There is an open conversation already to ${To}`
        }
      } else
        return {
          success: false,
          errorMessage: `Error sending message. Error occured adding ${To} channel`
        }
    }
  } else {
    channel = PreviousConversation
    channel.sid = PreviousConversation.conversationSid
  }

  // Point the channel to Studio
  await client.conversations.conversations(channel.sid).webhooks.create({
    target: 'studio',
    configuration: { flowSid: InboundStudioFlow }
  })

  // Add agents initial message
  await client.conversations
    .conversations(channel.sid)
    .messages.create({ author: WorkerFriendlyName, body: Body })

  return { success: true, channelSid: channel.sid }
}

// exports.handler = TokenValidator(async function (context, event, callback) {
exports.handler = async function (context, event, callback) {
  const {
    To,
    From,
    Body,
    WorkspaceSid,
    WorkflowSid,
    QueueSid,
    WorkerSid,
    WorkerFriendlyName,
    InboundStudioFlow,
    OpenChatFlag,
    KnownAgentRoutingFlag
  } = event

  const client = context.getTwilioClient()
  // Create a custom Twilio Response
  // Set the CORS headers to allow Flex to make an HTTP request to the Twilio Function
  const response = new Twilio.Response()
  response.appendHeader('Access-Control-Allow-Origin', '*')
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET')
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type')

  try {
    let sendResponse = null

    const PreviousConversation = await fetchPreviousConversations(client, To)


    if (OpenChatFlag && PreviousConversation == null) {
      // create task and add the message to a channel
      sendResponse = await openAChatTask(
        client,
        To,
        From,
        Body,
        WorkerFriendlyName,
        {
          workspace_sid: WorkspaceSid,
          workflow_sid: WorkflowSid,
          queue_sid: QueueSid,
          worker_sid: WorkerSid
        }
      )
    } else if (PreviousConversation != null) {

      sendResponse = await unparkInteraction(client, PreviousConversation, {
        workspace_sid: WorkspaceSid,
        workflow_sid: WorkflowSid,
        queue_sid: QueueSid,
        worker_sid: WorkerSid
      });
      if (sendResponse.success) {
        await client.conversations
          .conversations(PreviousConversation.conversationSid)
          .messages.create({ author: WorkerFriendlyName, body: Body })
      } else {
        await client.conversations
          .conversations(PreviousConversation.conversationSid).update({ state: "closed" });
        sendResponse = await openAChatTask(
          client,
          To,
          From,
          Body,
          WorkerFriendlyName,
          {
            workspace_sid: WorkspaceSid,
            workflow_sid: WorkflowSid,
            queue_sid: QueueSid,
            worker_sid: WorkerSid
          }
        )
      }

    } else {

      // create a channel but wait until customer replies before creating a task
      sendResponse = await sendOutboundMessage(
        client,
        To,
        From,
        Body,
        KnownAgentRoutingFlag,
        WorkerFriendlyName,
        InboundStudioFlow,
        PreviousConversation
      )
    }

    response.appendHeader('Content-Type', 'application/json')
    response.setBody(sendResponse)
    // Return a success response using the callback function.
    callback(null, response)
  } catch (err) {
    response.appendHeader('Content-Type', 'plain/text')
    response.setBody(err.message)
    response.setStatusCode(500)
    // If there's an error, send an error response
    // Keep using the response object for CORS purposes
    console.error(err)
    callback(null, response)
  }
}
