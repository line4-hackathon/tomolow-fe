import React from 'react'
import styled from 'styled-components'
import Logo from '@/assets/images/logo-login.svg?react'

const ChargeGuide = () => {
  return (
    <GuideContainer>
      <Logo />
      <Title>{`광고를 시청하거나 \n결제를 통해 모의 투자금을 충전하세요`}</Title>
    </GuideContainer>
  )
}

export default ChargeGuide

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`
const Title = styled.p`
  color: var(--Neutral-900, #333);
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  white-space: pre-line;
`
