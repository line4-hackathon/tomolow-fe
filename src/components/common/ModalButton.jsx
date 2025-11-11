import React from 'react'
import styled from 'styled-components'

function ModalButton({ label, color, backgroundcolor, onClick }) {
  return (
    <Button $color={color} $backgroundcolor={backgroundcolor} onClick={onClick}>
      {label}
    </Button>
  )
}

export default ModalButton

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  border-radius: 12px;
  padding: 12px 0;
  text-align: center;
  cursor: pointer;
  color: var(--Neutral-500, #6d6d6d);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ $color }) => $color || '#fff'};
  background-color: ${({ $backgroundcolor }) => $backgroundcolor || '#4880af'};
  border: none;
  transition: background-color 0.2s ease;
`
