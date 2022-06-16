import { createContext } from 'react'

export const PanelContext = createContext({
  theme: null,
  toNumber: '',
  messageBody: '',
  setToNumber: () => null,
  setMessageBody: () => null,
  onSendClickHandler: () => null
})
