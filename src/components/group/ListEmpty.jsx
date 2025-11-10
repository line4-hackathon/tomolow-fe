import React from 'react'
import styled from 'styled-components'
import profile from '@/assets/icons/icon-profile.svg'

const ListEmpty = ({ emptyMessage }) => {
  return (
    <Container>
      <Img src={profile} />
      <Text>{emptyMessage}</Text>
    </Container>
  )
}

export default ListEmpty

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`
const Img = styled.img``
const Text = styled.p`
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
