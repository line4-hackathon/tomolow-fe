// src/pages/learning/HoldingStockPage.jsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import HoldingStock from '@/components/learning/HoldingStock'
import SearchBar from '@/components/common/searchBar'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import NothingHeart from '@/assets/icons/icon-heart-navy.svg?react'

// 환경변수에서 서버 주소
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// (임시) 챗봇과 같은 토큰 사용
const TEMP_FAKE_TOKEN =
"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzb295ZW9uIiwianRpIjoic29veWVvbiIsImlhdCI6MTc2Mjc1NTQ0MiwiZXhwIjoxNzYyNzU3MjQyfQ.4XcjHOK4_YPTcCT9F9QV6SNEt3TDhokYfhHT6FVzP5U"
const getAuthHeader = () => ({
  Authorization: `Bearer ${TEMP_FAKE_TOKEN}`,
})

export default function HoldingStockPage() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHolding = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/chatbot/market/holding`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        })

        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          const text = await res.text()
          console.error('holding 응답이 JSON 이 아닙니다:', text)
          setError('서버에서 올바르지 않은 응답이 왔습니다.')
          return
        }

        const json = await res.json()
        console.log('holding response:', json)

        if (!res.ok || !json.success) {
          setError(json.message || '보유 주식 정보를 불러오지 못했습니다.')
          setStocks([])
          return
        }

        // data: [{ symbol, name, imageUrl, price, changeRate, interested }, ... ]
        setStocks(json.data || [])
      } catch (err) {
        console.error('holding error:', err)
        setError('서버 통신 중 오류가 발생했습니다.')
        setStocks([])
      } finally {
        setLoading(false)
      }
    }

    fetchHolding()
  }, [])

  const hasStock = stocks.length > 0

  return (
    <Page>
      <Header title="학습" />
      <Title>보유 중인 주식</Title>
      <Contents>
        <SearchBar explain="주식명 혹은 주식코드를 입력하세요" />

        {loading ? (
          <Message>불러오는 중...</Message>
        ) : error ? (
          <Message>{error}</Message>
        ) : hasStock ? (
          <StockCardBox>
            {stocks.map((stock, idx) => (
              <React.Fragment key={stock.symbol ?? idx}>
                <HoldingStock stock={stock} />
                {idx !== stocks.length - 1 && <Line />}
              </React.Fragment>
            ))}
          </StockCardBox>
        ) : (
          <Nothing>
            <NothingHeart />
            <p>보유 중인 주식이 없어요</p>
          </Nothing>
        )}
      </Contents>
      <MenuBar />
    </Page>
  )
}


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

const Title = styled.h2`
  color: var(--Neutral-900, #333);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 140% */
  padding: 32px 0 0 16px;
`

const Message = styled.p`
  margin-top: 120px;
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;
`