import React, { useState } from 'react'

function useModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(1) // 1: 코드 입력, 2: 인증 성공, 3: 인증 오류
  const [code, setCode] = useState('')
  const open = () => {
    setStep(1)
    setCode('')
    setIsOpen(true)
  }
  const close = () => {
    setStep(1)
    setCode('')
    setIsOpen(false)
  }

  const goSuccess = () => {
    setStep(2)
  }

  const goFail = () => {
    setStep(3)
  }

  const retry = () => {
    setStep(1)
    setCode('')
  }
  return { isOpen, step, code, setCode, open, close, goSuccess, goFail, retry }
}

export default useModal
