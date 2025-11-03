import React from 'react'
import styled from 'styled-components'

function LargeButton({ label, color, backgroundcolor, onClick }) {
  return (
    <Button color={color} backgroundcolor={backgroundcolor} onClick={onClick}>
      {label}
    </Button>
  )
}

export default LargeButton

const Button = styled.button`
  width: 100%;
  display: flex;
  padding: 16px 0;
  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  cursor: pointer;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${({ color }) => color || '#fff'};
  background-color: ${({ backgroundcolor }) => backgroundcolor || '#4880af'};
  border: none;
  transition: background-color 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`
