// Toast.jsx
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

// 2. Framer Motion 애니메이션 Variants 정의
const toastVariants = {
  // 등장 애니메이션: 아래에서 위로 올라오며 투명도 증가
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  // 퇴장 애니메이션: 아래로 내려가며 투명도 감소
  hidden: { y: '100%', opacity: 0, transition: { duration: 0.5 } },
}

// duration을 2500ms (2.5초)로 설정
export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    // 메시지가 표시되면 duration(2.5초) 후에 닫기 함수 호출
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    // 컴포넌트 정리 시 타이머 제거
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <BackGround>
    <ToastContainer
      variants={toastVariants}
      initial='hidden' // 시작 상태
      animate='visible' // 등장 애니메이션 실행
      exit='hidden' // 퇴장 애니메이션 실행 (AnimatePresence가 처리)
    >
      {message}
    </ToastContainer>
    </BackGround>
  )
}
const BackGround = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`
// 1. 스타일 정의: motion.div를 사용하여 Framer Motion과 결합
const ToastContainer = styled(motion.div)`
  height: 72px;
  display: flex;
  padding: 0 16px 0 16px;
  justify-content: center;
  align-items: center;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);

  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  color: var(--Neutral-900, #333);
  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
