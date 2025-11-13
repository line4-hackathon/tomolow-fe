import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import DayPicker from '@/components/hometransaction/DayPicker'
import InvestSummaryCard from '@/components/hometransaction/InvestSummaryCard'
import TransactionList from '@/components/hometransaction/TransactionList'
import MenuBar from '@/components/common/MenuBar'

const formatting = (n) => String(n).padStart(2, '0')
const getTodayDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${formatting(d.getMonth() + 1)}-${formatting(d.getDate())}`
}

const GroupTransactionPage = () => {
  // 날짜 범위
  const [range, setRange] = useState({
    start: '2025-01-01',
    end: getTodayDate(),
  })
  // 요약 정보
  const [summary, setSummary] = useState({})
  // 거래내역 리스트
  const [transactions, setTransactions] = useState([])
  const { groupId } = useParams()

  // 연동
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const token = localStorage.getItem('accessToken')

  const getTransactions = async () => {
    try {
      let url = ''
      if (range.start === '2025-01-01' && range.end === getTodayDate()) {
        url = `${apiUrl}/api/group/${groupId}/transactions/history/default`
      } else {
        url = `${apiUrl}/api/group/${groupId}/transactions/history?startDate=${range.start}&endDate=${range.end}`
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.data.success) return

      const data = res.data.data

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
      <Scrollable>
        <Header title='거래내역' showIcon='true' path={`/group/home/${groupId}`} />
        <TopContainer>
          <DayPicker value={range} onApply={setRange} />
          <InvestSummaryCard summary={summary} />
        </TopContainer>
        <BottomContainer>
          <TransactionList transactions={transactions} />
        </BottomContainer>
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default GroupTransactionPage

const TopContainer = styled.div`
  padding: 32px 16px 0 16px;
`

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 16px 32px 16px;
  background: var(--Neutral-50, #f6f6f6);
  flex: 1;
`
