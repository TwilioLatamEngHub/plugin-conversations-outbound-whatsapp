import { useContext } from 'react'
import {
  MenuButton,
  MenuItem,
  Menu,
  MenuSeparator,
  useMenuState
} from '@twilio-paste/core'
import { ChevronDownIcon } from '@twilio-paste/icons/esm/ChevronDownIcon'

import { PanelContext } from '../../contexts/contexts'

export const SendMessageMenu = ({ isDisabled }) => {
  const { onClickHandler } = useContext(PanelContext)
  const menu = useMenuState()

  return (
    <>
      <MenuButton {...menu} variant='primary' disabled={isDisabled}>
        Send message.... <ChevronDownIcon decorative />
      </MenuButton>
      <Menu {...menu} aria-label='Actions'>
        <MenuItem {...menu} onClick={() => onClickHandler('OPEN_CHAT')}>
          ....and open chat with customer
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          {...menu}
          onClick={() => onClickHandler('SEND_MESSAGE_REPLY_ME')}
        >
          ....and open chat with customer when they reply (route reply to me)
        </MenuItem>
        <MenuSeparator />
        <MenuItem {...menu} onClick={() => onClickHandler('SEND_MESSAGE')}>
          ....and open chat with customer when they reply (route reply to any
          agent)
        </MenuItem>
      </Menu>
    </>
  )
}
