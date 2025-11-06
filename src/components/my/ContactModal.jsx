import React from 'react'
import { Background, ModalContainer, Text } from '../group/Modal.styled'
import styled from 'styled-components'

const ContactModal = ({ onClick }) => {
  return (
    <Background>
      <ModalContainer>
        <Text>{'문의사항은\nTomoLowofficial@gmail.com\n메일로 문의해주세요'}</Text>
        <Button onClick={onClick}>닫기</Button>
      </ModalContainer>
    </Background>
  )
}

export default ContactModal

const Button = styled.button`
  width: 100%;
  padding: 12px;
  color: var(--Neutral-0, #fff);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  border-radius: 12px;
  border: none;
  background: var(--Primary-500, #4880af);
  cursor: pointer;
`
