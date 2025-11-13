import React from 'react'
import styled from 'styled-components'
import RightArrowIcon from '@/assets/icons/icon-right-arrow.svg'

function GroupMiniButton({ img, label, onClick }) {
  return (
    <ButtonContainer onClick={onClick}>
      <Img src={img} />
      <Text>{label}</Text>
      <Icon src={RightArrowIcon} />
    </ButtonContainer>
  )
}

export default GroupMiniButton

const ButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  width: fit-content;
  border: none;
  padding: 24px 7px;
  cursor: pointer;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  transition:
    background-color 0.1s ease,
    transform 0.1s ease,
    font-size 0.1s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    pointer-events: none;
    border-radius: 12px;
    transition: background-color 0.1s ease;
  }

  &:active {
    font-size: 0.95em;

    transform: scale(0.98);

    &::before {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`

const Img = styled.img``

const Text = styled.p`
  padding: 0 23px 0 8px;
  border: none;
  background-color: #fff;
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`

const Icon = styled.img``
