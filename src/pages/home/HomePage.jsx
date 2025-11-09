// src/pages/home/HomePage.jsx
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Header from '@/components/common/Header.jsx'
import HomeHeader from '@/components/home/HomeHeader.jsx'
import MyAssets from '@/components/home/MyAssets.jsx'
import HoldInterest from '@/components/home/HoldInterest.jsx'
import WaitingOrder from '@/components/home/WaitingOrder.jsx'
import MenuBar from '@/components/common/MenuBar.jsx'

// 거래내역 관련 컴포넌트
import DayPicker from '@/components/hometransaction/DayPicker'
import InvestSummaryCard from '@/components/hometransaction/InvestSummaryCard'
import TransactionList from '@/components/hometransaction/TransactionList'
import { dummyData } from '@/components/hometransaction/dummyData' //더미데이터

// 날짜 포맷팅 함수
const formatting = (n) => String(n).padStart(2, '0')
const getTodayDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${formatting(d.getMonth() + 1)}-${formatting(d.getDate())}`
}

function HomePage() {
  // 상단 탭 선택
  const [selectedTab, setSelectedTab] = useState('asset')

  // 거래내역 더미데이터 로드
  const [range, setRange] = useState({
    start: '2025-01-01',
    end: getTodayDate(),
  })

  const [summary, setSummary] = useState({})
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const found = dummyData.find(
      (d) => new Date(d.start) <= new Date(range.end) && new Date(d.end) >= new Date(range.start),
    )

    if (found) {
      setSummary(found.summary)
      setTransactions(found.transactions)
    } else {
      setSummary({ profit: 0, profitRate: 0, totalBuy: 0, totalSell: 0 })
      setTransactions([])
    }
  }, [range])

  return (
    <>
      <Container>
        <Header title='홈' />
        <HomeHeader selectedTab={selectedTab} onChangeTab={setSelectedTab} />{' '}
        {/* 상단 헤더 + 탭 + 배너 */}
        {selectedTab === 'asset' ? (
          <>
            <MyAssets /> {/* 내 자산 현황 */}
            <HoldInterest /> {/* 보유 관심 종목 */}
            <WaitingOrder /> {/* 대기 주문 */}
          </>
        ) : (
          <>
            <TopContainer>
              <DayPicker value={range} onApply={setRange} />
              <InvestSummaryCard summary={summary} />
            </TopContainer>
            <BottomContainer>
              <TransactionList transactions={transactions} />
            </BottomContainer>
          </>
        )}
      </Container>
      <MenuBar /> {/* 하단 탭바 */}
    </>
  )
}

export default HomePage

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  background-color: #f9f9fb;
  overflow-y: auto;
  padding-bottom: 64px; /* 하단바 높이만큼 여백 추가 */
`
const TopContainer = styled.div`
  padding: 0 16px;
  background-color: #fff;
`

const BottomContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px 16px 32px 16px;
  background: var(--Neutral-50, #f6f6f6);
  flex: 1;
`
