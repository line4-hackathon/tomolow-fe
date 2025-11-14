import React, { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Container>
      <Circle> </Circle>

      <BigText>TomoLow</BigText>
      <SmallText>투자는 모의로 리스크는 로우로</SmallText>
    </Container>
  )
}

export default LandingPage

/** 글씨만 페이드 + 슬라이드 업 애니메이션 */
const fadeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const Container = styled.div`
  background-color: #4880af;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 100dvh;
`

const BigText = styled.p`
  color: #fff;
  font-family: Inter;
  font-size: 36px;
  font-weight: 700;
  animation: ${fadeUp} 0.7s ease-out forwards;
  text-align: center;
`

const SmallText = styled.p`
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  animation: ${fadeUp} 0.7s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
  text-align: center;
`
const Circle = styled.div`
  position: absolute;
  width: 1200px;
  height: 1200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  left: -400px;
  bottom: -600px;
`
