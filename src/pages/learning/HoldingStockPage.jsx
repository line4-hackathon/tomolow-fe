// src/pages/learning/HoldingStockPage.jsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import HoldingStock from '@/components/learning/HoldingStock'
import SearchBar from '@/components/learning/searchbar'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import NothingHeart from '@/assets/icons/icon-heart-navy.svg?react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function HoldingStockPage() {
  const [stocks, setStocks] = useState([])     // 전체 보유 자산
  const [query, setQuery] = useState('')       // 검색어 상태
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 📌 보유 자산 불러오기
  useEffect(() => {
    const fetchHolding = async () => {
      const token = getAccessToken()
      if (!token) {
        setError('로그인 후 이용 가능한 서비스입니다.')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/chatbot/market/holding`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        })

        const json = await res.json()
        console.log('holding response:', json)

        if (!res.ok || !json.success) {
          setError(json.message || '보유 자산을 불러오지 못했습니다.')
          return
        }

        setStocks(json.data || [])
      } catch (err) {
        console.error('holding error:', err)
        setError('서버 통신 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (!API_BASE_URL) {
      setError('서버 주소 설정이 올바르지 않습니다.')
      setLoading(false)
      return
    }

    fetchHolding()
  }, [])

  // 보유 자산 중에서 검색 필터링
  const filteredStocks = stocks.filter(stock => {
    const q = query.trim().toLowerCase()
    if (!q) return true

    const name = (stock.name || '').toLowerCase()
    const symbol = (stock.symbol || '').toLowerCase()

    return name.includes(q) || symbol.includes(q)
  })

  return (
    <Page>
      <Header title="학습" />
      <Contents>
        <SearchBar
          explain="보유중인 자산을 검색해보세요"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {/* 상태별 렌더링 */}
        {loading ? (
          <Message>불러오는 중...</Message>
        ) : error ? (
          <Message>{error}</Message>
        ) : filteredStocks.length > 0 ? (
          <StockCardBox>
            {filteredStocks.map((stock, idx) => (
              <React.Fragment key={stock.symbol ?? idx}>
                <HoldingStock stock={stock} />
                {idx !== filteredStocks.length - 1 && <Line />}
              </React.Fragment>
            ))}
          </StockCardBox>
        ) : (
          <Nothing>
            <NothingHeart />
            <p>검색 결과가 없어요</p>
          </Nothing>
        )}
      </Contents>
      <MenuBar />
    </Page>
  )
}

/* ---------------- styled-components ---------------- */

const Page = styled.div``

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  gap: 32px;
  align-items: center;
  margin-top: 32px;
`

const StockCardBox = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  scrollbar-width: none;
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: var(--Neutral-200, #d1d1d1);
`

const Nothing = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;
  font-size: 16px;
`

const Message = styled.p`
  margin-top: 120px;
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;
`