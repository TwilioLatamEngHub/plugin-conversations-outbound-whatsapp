import { useContext } from 'react'
import { Dialer } from '@twilio/flex-ui'

import { PanelContext } from '../../contexts/contexts'
import { Caption, DialerContainer } from './DialerComponent.styles'

export const DialerComponent = () => {
  const { theme, toNumber, setToNumber } = useContext(PanelContext)

  return (
    <DialerContainer theme={theme}>
      <Caption
        key='wa-outbound-input'
        htmlFor='dwa-outbound-input'
        theme={theme}
      >
        Enter a number
      </Caption>
      <Dialer
        key='dialer'
        onDial={setToNumber}
        defaultPhoneNumber={toNumber}
        onPhoneNumberChange={setToNumber}
        hideActions
        disabled={false}
        defaultCountryAlpha2Code={'BR'}
      />
    </DialerContainer>
  )
}
