import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import DayPicker from '@/components/hometransaction/DayPicker'
import InvestSummaryCard from '@/components/hometransaction/InvestSummaryCard'
import TransactionList from '@/components/hometransaction/TransactionList'
import MenuBar from '@/components/common/MenuBar'
import { dummyData } from '@/components/hometransaction/dummyData' //더미데이터

const formatting = (n) => String(n).padStart(2, '0')
const getTodayDate = () => {
  const d = new Date()
  return `${d.getFullYear()}-${formatting(d.getMonth() + 1)}-${formatting(d.getDate())}`
}

const GroupTransactionPage = () => {
  const [range, setRange] = useState({
    start: '2025-01-01',
    end: getTodayDate(),
  })
  const [summary, setSummary] = useState({})
  const [transactions, setTransactions] = useState([])
  const { groupId } = useParams()

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
