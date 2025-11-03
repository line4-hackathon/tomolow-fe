import React from 'react'
import styled from 'styled-components'
import CheckGray from '@/assets/icons/icon-check-gray.svg'
import CheckBlue from '@/assets/icons/icon-check-blue.svg'
import CheckRed from '@/assets/icons/icon-check-red.svg'

function StatusMessage({ status = 'default', text }) {
  const iconSrc = status === 'success' ? CheckBlue : status === 'error' ? CheckRed : CheckGray
  const color = status === 'success' ? '#0084FE' : status === 'error' ? '#FF2E4E' : '#B0B0B0'
  return (
    <Container>
      <Text $color={color}>{text}</Text>
      <Icon src={iconSrc} alt='' />
    </Container>
  )
}

export default StatusMessage

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-top: 8px;
`

const Text = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: ${({ $color }) => $color};
`

const Icon = styled.img``
