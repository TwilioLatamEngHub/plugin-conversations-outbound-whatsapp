import { useContext, useEffect, useState } from 'react'
import { Select, Option, HelpText } from '@twilio-paste/core'
import { PhoneNumberUtil } from 'google-libphonenumber'

import { SendMessageMenu } from '../SendMessageMenu/SendMessageMenu'
import { PanelContext } from '../../contexts/contexts'
import { templates } from '../../utils/templates'
import {
  MessageContainer,
  SendMessageContainer
} from './MessageComponent.styles'

export const MessageComponent = () => {
  const { theme, setMessageBody, toNumber } = useContext(PanelContext)
  const [isDisabled, setIsDisabled] = useState(true)

  // OPTIONAL: This piece of code validates the phone number using google's libphonenumber
  useEffect(() => {
    const phoneUtil = PhoneNumberUtil.getInstance()

    try {
      const parsedToNumber = phoneUtil.parse(toNumber)

      if (phoneUtil.isPossibleNumber(parsedToNumber))
        phoneUtil.isValidNumber(parsedToNumber)
          ? setIsDisabled(false)
          : setIsDisabled(true)
    } catch (err) {}
  }, [toNumber])

  return (
    <MessageContainer theme={theme}>
      <Select
        id='select_template'
        htmlFor='select_template'
        required
        onChange={e => setMessageBody(e.target.value)}
      >
        {templates.map(template => (
          <Option value={template} key={template}>
            {template}
          </Option>
        ))}
      </Select>
      <HelpText variant='default'>Choose a Template</HelpText>
      <SendMessageContainer theme={theme}>
        <SendMessageMenu isDisabled={isDisabled} />
      </SendMessageContainer>
    </MessageContainer>
  )
}
