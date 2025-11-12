import React, { useEffect } from 'react'
import styled from 'styled-components'

function Toast({ msg, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onClose])
  return (
    <ToastContainer>
      <Text>{msg}</Text>
    </ToastContainer>
  )
}

export default Toast

const ToastContainer = styled.div`
  position: fixed;
  min-width: 252px;
  max-width: 284px;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 16px;
  transform: translate(-50%, -50%);
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

const Text = styled.p`
  color: #333;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  white-space: pre-line;
  text-align: center;
`
