import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

function AssetDonut({
  investAmount = 2333354, // 투자
  cashAmount = 81455000,  // 현금
  bgColor = '#FFFFFF',    // 도넛 안쪽(배경) 색
}) {
    const total = investAmount + cashAmount

    // 0 ~ 1 사이 애니메이션 진행도
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let start = null
        const duration = 1500 // ms

        const animate = (timestamp) => {
        if (!start) start = timestamp
        const elapsed = timestamp - start
        const t = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3) // ease-out
        setProgress(eased)
        if (t < 1) requestAnimationFrame(animate)
        }

        setProgress(0)
        requestAnimationFrame(animate)
    }, [investAmount, cashAmount])

    if (!total) {
        const gradient = `conic-gradient(
        transparent 0deg 180deg,
        #E8EEF6 180deg 360deg
        )`
        return (
        <Wrapper>
            <OuterCircle style={{ backgroundImage: gradient }}>
            <InnerCircle $bg={bgColor} />
            </OuterCircle>
        </Wrapper>
        )
    }

    const ratio = investAmount / total          // 투자 비율 (0~1)
    const investAngle = 180 * ratio             // 투자 전체 각도
    const sweepAngle = 180 * progress           // 지금까지 그려진 전체 각도 (0~180)

    const start = 180                           // 윗 반원 시작 각도
    const sweepEnd = start + sweepAngle         // 지금 프레임에서의 끝 각도

    let gradient = ''

    if (sweepAngle <= investAngle) {
        const investEnd = start + sweepAngle
        gradient = `conic-gradient(
        transparent 0deg 180deg,
        #4880AF 180deg ${investEnd}deg,
        transparent ${investEnd}deg 360deg
        )`
    } else {
        const investEnd = start + investAngle
        gradient = `conic-gradient(
        transparent 0deg 180deg,
        #4880AF 180deg ${investEnd}deg,
        #E8EEF6 ${investEnd}deg ${sweepEnd}deg,
        transparent ${sweepEnd}deg 360deg
        )`
    }

    return (
        <Wrapper>
        <OuterCircle style={{ backgroundImage: gradient }}>
            <InnerCircle $bg={bgColor} />
        </OuterCircle>
        </Wrapper>
    )
}

export default AssetDonut


const Wrapper = styled.div`
    width: 300px;
    height: 150px;  
    overflow: hidden;   
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`

const OuterCircle = styled.div`
    position: relative;
    width: 300px;
    height: 300px;      
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    transform: rotate(90deg); 
`

const InnerCircle = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;        
    height: 200px;
    border-radius: 50%;
    background-color: ${({ $bg }) => $bg};
    transform: translate(-50%, -50%);
`