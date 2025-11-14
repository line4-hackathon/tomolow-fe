// src/pages/learning/SelectDatePage.jsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'

import Header from '@/components/common/FixedHeader'
import StockInfo from '@/components/invest/stockInfo'
import Chart from '@/components/invest/chart'
import useSelect from '@/hooks/select'
import useStockStore from '@/stores/stockStores'
import { APIService } from '../invest/api'

// 화면에 보여줄용 한국식 날짜 포맷터
const formatKoreanDate = value => {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    // 이상한 문자열이면 그냥 원래 값 그대로 보여줌
    return String(value)
  }

  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `${y}년 ${m}월 ${d}일`
}

// API로 보낼 YYYY-MM-DD 포맷터
const formatAPIDate = value => {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function SelectDatePage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { stock } = location.state || {} // { name, symbol, ... }

  const { stockData, setStockData } = useStockStore()
  const { selectedMenu, handleSelect } = useSelect('DAY')

  // 오늘 날짜로 초기값 설정 (한 번만 실행됨)
  const todayISO = new Date().toISOString()
  const [startDate, setStartDate] = useState(todayISO)
  const [endDate, setEndDate] = useState(todayISO)
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (stock && stock.symbol) {
      setStockData(stock)
    }
  }, [stock, setStockData])

  const effectiveStock = stock || stockData
  const symbol = effectiveStock?.symbol

  const handleLoad = () => {
    if (!effectiveStock || !symbol) return

    const stockName =
      effectiveStock?.name || effectiveStock?.symbol || '선택한 종목'

    // 화면용 안내 문구
    const metaText =
      `${stockName}의 ${formatKoreanDate(startDate)}부터 ${formatKoreanDate(
        endDate,
      )}까지 뉴스 정보를 바탕으로 답변드릴게요.\n` +
      '궁금한 점을 물어봐주세요.'

    // API로 보낼 날짜
    const apiStartDate = formatAPIDate(startDate)
    const apiEndDate = formatAPIDate(endDate)

    navigate('/learning', {
      state: {
        data_selected: true,
        tickers: symbol, // 예: "ETH"
        start_date: apiStartDate, // "2025-05-05"
        end_date: apiEndDate, // "2025-05-31"
        metaText, // 챗봇 첫 안내 문구
      },
    })
  }

  useEffect(() => {
    if (!symbol) {
      console.log('심볼 없음')
      return
    }

    const tfMap = {
      DAY: 'D1',
      WEEK: 'W1',
      MONTH: 'M1',
      THREEMONTH: 'M3',
      YEAR: 'Y1',
    }

    const tf = tfMap[selectedMenu]
    if (!tf) return

    const fetchChartData = async () => {
      try {
        const res = await APIService.private.get(
          `/api/candles/${symbol}?tf=${tf}`,
        )
        setChartData(res.data)
      } catch (error) {
        console.error('차트 조회 실패', error)
      }
    }

    fetchChartData()
  }, [selectedMenu, symbol])

  return (
    <Page>
      <Header title="학습"  showIcon={true}/>
      <Contents>
        <StockInfo />

        <Chart
          selectedDate={selectedMenu}
          setSelectedDate={handleSelect}
          symbol={symbol}
          chartData={chartData}
          setStartDate={setStartDate} // 이 안에서 ISO나 Date를 넣어줘도 됨
          setEndDate={setEndDate}
        />

        <DateCard>
          <DateRow>
            <DateLabel>시작일</DateLabel>
            <DateValue>{formatKoreanDate(startDate)}</DateValue>
          </DateRow>
          <DateRow>
            <DateLabel>종료일</DateLabel>
            <DateValue>{formatKoreanDate(endDate)}</DateValue>
          </DateRow>
        </DateCard>

        <BottomBar>
          <LoadButton onClick={handleLoad}>불러오기</LoadButton>
        </BottomBar>
      </Contents>
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
  display: flex;
  width: 310px;
  padding: var(--Spacing-L, 16px) 16px;
  margin-left: 17px;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Spacing-L, 16px);
  align-self: stretch;
  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

const DateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const DateLabel = styled.div`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`

const DateValue = styled.div`
  color: var(--Primary-500, #4880af);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 140% */
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