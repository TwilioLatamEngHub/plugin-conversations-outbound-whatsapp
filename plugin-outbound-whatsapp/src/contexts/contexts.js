import { createContext } from 'react'

export const PanelContext = createContext({
  theme: null,
  toNumber: '',
  setToNumber: () => null,
  setMessageBody: () => null,
  onSendClickHandler: () => null
})
