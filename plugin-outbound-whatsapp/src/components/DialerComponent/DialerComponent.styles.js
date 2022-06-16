import styled from 'styled-components'

export const Caption = styled('label')`
  display: block;
  font-size: ${p => p.theme.tokens.fontSizes.fontSize30};
  line-height: 1.6;
  font-weight: ${p => p.theme.tokens.fontWeights.fontWeightSemibold};
  margin-top: ${p => p.theme.tokens.spacings.space50};
  margin-bottom: ${p => p.theme.tokens.spacings.space20};
  width: 100%;
`

export const DialerContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 276px;
  padding: 0 ${p => p.theme.tokens.spacings.space50};
  box-sizing: border-box;

  & > div > div > button {
    color: #0263e0;
  }
`
