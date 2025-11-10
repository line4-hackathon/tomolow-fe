// src/pages/learning/SelectDatePage.jsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

import Header from '@/components/common/Header'
import StockInfo from '@/components/invest/stockInfo' // 투자 페이지에서 쓰던 거 그대로
import Chart from '@/components/invest/chart'

export default function SelectDatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { stock } = location.state || {} // 보유 주식 페이지에서 넘겨줄 예정

  // 일단은 더미 날짜 (나중에 date-picker 붙이면 여기만 바꾸면 됨)
  const [startDate] = useState('2025년 1월 1일')
  const [endDate] = useState('2025년 1월 6일')

  const handleLoad = () => {
    // TODO: 여기서 챗봇으로 돌아가면서 선택한 주식/기간 전달 예정
    // 예시:
    // navigate('/learning', { state: { stock, startDate, endDate } })

    console.log('선택한 종목:', stock)
    console.log('기간:', startDate, '~', endDate)
  }

  return (
    <Page>
      <Header title="학습" />
      <Contents>
        {/* 종목 정보 영역 - 현재 StockInfo 가 알아서 그려준다고 가정 */}
        <StockInfo />
        {/* 차트 + 1D / 1W / 3M / 6M / 1Y 영역 그대로 재사용 */}
        <Chart />
        {/* 기간 카드 */}
        <DateCard>
          <DateRow>
            <DateLabel>시작일</DateLabel>
            <DateValue>{startDate}</DateValue>
          </DateRow>
          <Divider />
          <DateRow>
            <DateLabel>종료일</DateLabel>
            <DateValue>{endDate}</DateValue>
          </DateRow>
        </DateCard>
      </Contents>
      <BottomBar>
          width="343px"
          height="56px"
          onClick={handleLoad}
        
          불러오기
      </BottomBar>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Contents = styled.div`
  width: 375px;
  height: 590px;
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  gap: 24px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
`

const DateCard = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
  align-self: center;
  width: 343px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.04);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const DateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const DateLabel = styled.div`
  color: #777;
  font-size: 14px;
`

const DateValue = styled.div`
  color: #2b5276;
  font-size: 18px;
  font-weight: 600;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #e5e5e5;
`

const BottomBar = styled.footer`
  display: flex;
  width: 375px;
  align-items: center;
  justify-content: center;
  height: 88px;
`