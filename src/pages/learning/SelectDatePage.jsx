// src/pages/learning/SelectDatePage.jsx
import React, { useState } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

import Header from '@/components/common/Header'
import StockInfo from '@/components/invest/stockInfo'
import Chart from '@/components/invest/chart'

export default function SelectDatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { stock } = location.state || {}   // { name, symbol, ... } 라고 가정

  // 일단 더미 날짜 (나중에 date-picker 붙이면 여기만 수정)
  const [startDate] = useState('2025년 1월 1일')
  const [endDate] = useState('2025년 1월 6일')

  const handleLoad = () => {
    const stockName = stock?.name || stock?.symbol || '선택한 종목'

    const question = `${stockName}의 ${startDate}부터 ${endDate}까지 주가를 분석하고 변동 원인을 설명해줘`

    // 챗봇 페이지로 질문을 넘김
    navigate('/learning', {
      state: {
        autoQuestion: question,
      },
    })
  }

  return (
    <Page>
      <Header title="학습" />
      <Contents>
        <StockInfo />
        <Chart />
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
        <LoadButton onClick={handleLoad}>불러오기</LoadButton>
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

const LoadButton = styled.button`
  width: 343px;
  height: 56px;
  border: none;
  border-radius: 16px;
  background: #4880af;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`