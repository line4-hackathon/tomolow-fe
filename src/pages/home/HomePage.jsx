// src/pages/home/HomePage.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Header from '@/components/common/FixedHeader'
import HomeHeader from '@/components/home/HomeHeader.jsx'
import MyAssets from '@/components/home/MyAssets.jsx'
import HoldInterest from '@/components/home/HoldInterest.jsx'
import WaitingOrder from '@/components/home/WaitingOrder.jsx'
import MenuBar from '@/components/common/MenuBar.jsx'

// 거래내역 관련 컴포넌트
import DayPicker from '@/components/hometransaction/DayPicker'
import InvestSummaryCard from '@/components/hometransaction/InvestSummaryCard'
import TransactionList from '@/components/hometransaction/TransactionList'

// 날짜 포맷팅 함수
const formatting = (n) => String(n).padStart(2, '0')
const getTodayDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${formatting(d.getMonth() + 1)}-${formatting(d.getDate())}`
}

function HomePage() {
  // 상단 탭 선택
  const [selectedTab, setSelectedTab] = useState('asset')

  // 날짜 범위
  const [range, setRange] = useState({
    start: '2025-01-01',
    end: getTodayDate(),
  })

  // 요약 정보
  const [summary, setSummary] = useState({ profit: 0, profitRate: 0, totalBuy: 0, totalSell: 0 })
  // 거래내역 리스트
  const [transactions, setTransactions] = useState([])

  // 연동
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('accessToken')

  const getTransactions = async () => {
    try {
      let url = ''
      const isDefaultRange = range.start === '2025-01-01' && range.end === getTodayDate()
      if (isDefaultRange) {
        url = `${apiUrl}/api/transactions/history/default`
      } else {
        url = `${apiUrl}/api/transactions/history?startDate=${range.start}&endDate=${range.end}`
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.data.success) return

      const data = res.data.data

      // 첫 거래일을 시작일로 자동 세팅
      if (isDefaultRange) {
        const allDays = data.days

        if (allDays.length > 0) {
          const firstTradeDate = allDays[allDays.length - 1].date

          if (firstTradeDate !== range.start) {
            setRange({
              start: firstTradeDate,
              end: getTodayDate(),
            })
            return
          }
        }
      }
      // 받은 데이터 포맷팅
      const formattedTransactions = data.days.flatMap((day) =>
        day.items.map((item) => {
          // 일별 거래내역
          const traded = new Date(item.tradedAt)
          const koreaTime = new Date(traded.getTime() + 9 * 60 * 60 * 1000)

          return {
            date: day.date,
            time: koreaTime.toTimeString().slice(0, 5), //HH:MM 형태
            stock: item.name,
            price: item.price,
            quantity: item.quantity,
            amount: item.amount,
            type: item.tradeType === 'BUY' ? '매수' : '매도',
          }
        }),
      )

      setSummary({
        profit: data.periodPnlAmount,
        profitRate: data.periodPnlRate,
        totalBuy: data.totalBuyAmount,
        totalSell: data.totalSellAmount,
      })

      setTransactions(formattedTransactions)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getTransactions()
  }, [range])

  return (
    <>
      <Container>
        <Header title='홈' showIcon={false} />
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
