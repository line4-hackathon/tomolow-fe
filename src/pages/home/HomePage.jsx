// src/pages/home/HomePage.jsx
import React from 'react'
import styled from 'styled-components'
import Header from '@/components/common/Header.jsx'
import HomeHeader from '@/components/home/HomeHeader.jsx'
import MyAssets from '@/components/home/MyAssets.jsx'
import HoldInterest from '@/components/home/HoldInterest.jsx'
import WaitingOrder from '@/components/home/WaitingOrder.jsx'
import MenuBar from '@/components/common/MenuBar.jsx'

function HomePage() {
  return (
    <Container>
        <Header title="홈" />
        <HomeHeader />       {/* 상단 헤더 + 탭 + 배너 */}
        <MyAssets />         {/* 내 자산 현황 */}
        <HoldInterest />     {/* 보유 관심 종목 */}
        <WaitingOrder />     {/* 대기 주문 */}
        <MenuBar />          {/* 하단 탭바 */}
    </Container>
  )
}

export default HomePage

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: #f9f9fb;
    overflow-y: auto; 
`