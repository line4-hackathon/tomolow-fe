import React from 'react'
import styled from 'styled-components'

const Slogan = () => {
  return (
    <TextContainer>
      <BigText>{`투자는 모의로\n리스크는 로우로!`}</BigText>
      <SmallText>자산의 내일을 책임질 TomoLow입니다.</SmallText>
    </TextContainer>
  )
}

export default Slogan

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`

const BigText = styled.p`
  color: var(--Neutral-900, #333);
  text-align: center;
  white-space: pre-line;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
`

const SmallText = styled.p`
  color: var(--Neutral-900, #333);
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
