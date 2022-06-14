import { Actions, Manager } from '@twilio/flex-ui'

Actions.registerAction('ToggleOutboundWAPanel', () => {
  const isOutboundWAPanelOpen =
    !!Manager.getInstance().store.getState()['flex'].view.componentViewStates
      ?.outboundWAPanel?.isOutboundWAPanelOpen

  Actions.invokeAction('SetComponentState', {
    name: 'outboundWAPanel',
    state: { isOutboundWAPanelOpen: !isOutboundWAPanelOpen }
  })
})
