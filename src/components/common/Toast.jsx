import React, { useEffect } from 'react'
import styled from 'styled-components'

function Toast({ msg, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onClose])
  return <ToastMsg>{msg}</ToastMsg>
}

export default Toast

const ToastMsg = styled.div`
  position: fixed;
  display: flex;
  white-space: nowrap;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  padding: 24px 16px;
  transform: translate(-50%);
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  color: #333;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
