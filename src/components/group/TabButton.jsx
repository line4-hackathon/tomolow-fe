import React from 'react'
import styled from 'styled-components'

function TabButton({ label, active, onClick }) {
  return (
    <Button $active={active} onClick={onClick}>
      {label}
    </Button>
  )
}

export default TabButton

const Button = styled.button`
  background-color: #f6f6f6;
  color: ${({ $active }) => ($active ? '#2B5276' : '#B0B0B0')};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  border: none;
  cursor: pointer;

  // 버튼 활성화 시, 밑줄 표시
  &::after {
    content: '';
    display: block;
    height: 1px;
    background-color: #2b5276;
    width: ${({ $active }) => ($active ? '100%' : '0%')};
    margin-top: 8px;
  }
`
