import {
  MenuButton,
  MenuItem,
  Menu,
  MenuSeparator,
  useMenuState
} from '@twilio-paste/core'
import { ChevronDownIcon } from '@twilio-paste/icons/esm/ChevronDownIcon'
import { useSendClick } from '../../hooks/useSendClick'

export const SendMessageMenu = ({ isDisabled }) => {
  const menu = useMenuState()
  const { onSendClickHandler } = useSendClick()

  return (
    <>
      <MenuButton {...menu} variant='primary' disabled={isDisabled}>
        Send message.... <ChevronDownIcon decorative />
      </MenuButton>
      <Menu {...menu} aria-label='Actions'>
        <MenuItem {...menu} onClick={() => onSendClickHandler('OPEN_CHAT')}>
          ....and open chat with customer
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          {...menu}
          onClick={() => onSendClickHandler('SEND_MESSAGE_REPLY_ME')}
        >
          ....and open chat with customer when they reply (route reply to me)
        </MenuItem>
        <MenuSeparator />
        <MenuItem {...menu} onClick={() => onSendClickHandler('SEND_MESSAGE')}>
          ....and open chat with customer when they reply (route reply to any
          agent)
        </MenuItem>
      </Menu>
    </>
  )
}
