import React, { useState, useMemo } from 'react'
import styled from 'styled-components'
import Tab from '@/components/group/Tab'
import TransactionDateGroup from './TransactionDateGroup'
import IconEmpty from '@/assets/icons/icon-empty-transactions.svg?react'

const ITEMS = [
  { key: 'all', label: '전체' },
  { key: 'buy', label: '매수' },
  { key: 'sell', label: '매도' },
]

const TransactionList = ({ transactions = [] }) => {
  const [activeTab, setActiveTab] = useState('all')

  // 더미데이터 이용해서 탭별 데이터 필터링
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions

    return transactions.filter((t) => {
      if (activeTab === 'buy') return t.type === '매수'
      if (activeTab === 'sell') return t.type === '매도'
      return true
    })
  }, [activeTab, transactions])

  // 날짜별로 거래내역 배열 만들기
  const groupedTransactions = useMemo(() => {
    const grouped = {}

    filteredTransactions.forEach((t) => {
      if (!grouped[t.date]) {
        grouped[t.date] = []
      }
      grouped[t.date].push(t)
    })

    const result = Object.entries(grouped).map(([date, list]) => ({
      date,
      list,
    }))

    // 날짜 내림차순 정렬
    result.sort((a, b) => new Date(b.date) - new Date(a.date))

    return result
  }, [filteredTransactions])

  return (
    <>
      {/* 전체/매수/매도 탭 */}
      <Tab items={ITEMS} activeTab={activeTab} onChange={setActiveTab} />
      {/* 날짜별 매수, 매도 리스트 */}
      {groupedTransactions.length === 0 ? (
        <EmptyContainer>
          <IconEmpty />
          <EmptyText>거래 내역이 없습니다.</EmptyText>
        </EmptyContainer>
      ) : (
        groupedTransactions.map((g) => (
          <TransactionDateGroup key={g.date} date={g.date} list={g.list} />
        ))
      )}
    </>
  )
}

export default TransactionList

const EmptyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`
const EmptyText = styled.p`
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
