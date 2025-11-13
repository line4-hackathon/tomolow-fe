import React from 'react'
import styled from 'styled-components'

function LargeButton({ label, color, backgroundcolor, onClick }) {
  return (
    <Button $color={color} $backgroundcolor={backgroundcolor} onClick={onClick}>
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
  color: ${({ $color }) => $color || '#fff'};
  background-color: ${({ $backgroundcolor }) => $backgroundcolor || '#4880af'};
  border: none;

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
