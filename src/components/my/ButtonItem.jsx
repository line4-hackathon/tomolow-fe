import React from 'react'
import styled from 'styled-components'
import RightArrow from '@/assets/icons/icon-right-arrow.svg?react'

function ButtonItem({ icon, label, onClick }) {
  return (
    <Item onClick={onClick}>
      <Left>
        <Icon src={icon} />
        <Text>{label}</Text>
      </Left>
      <RightArrow />
    </Item>
  )
}

export default ButtonItem

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`

const Left = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`
const Icon = styled.img``

const Text = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
