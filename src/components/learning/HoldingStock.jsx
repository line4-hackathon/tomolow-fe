// src/pages/invest/HoldingPage.jsx
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import StockCard from '@/components/invest/stockCard'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import NothingIcon from '@/assets/icons/icon-search-not.svg?react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Chatbot이랑 임시로 같은 토큰 사용
const TEMP_FAKE_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzb295ZW9uIiwianRpIjoic29veWVvbiIsImlhdCI6MTc2MjYyNjM0NywiZXhwIjoxNzYyNjI4MTQ3fQ.HCS9NR64ROlD_Wi-d_XP5T2iPdD2e_3N46YaJTv85Vo'

const getAuthHeader = () => ({
  Authorization: `Bearer ${TEMP_FAKE_TOKEN}`,
})

export default function InvestHoldingPage() {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHolding = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/chatbot/market/holding`,
          {
            method: 'GET',
            headers: {
              ...getAuthHeader(),
            },
          },
        )

        const json = await res.json()
        console.log('holding response:', json)

        if (!json.success) {
          console.error(json.message)
          setStocks([])
          return
        }

        // data 가 배열이라고 가정 (보유 주식 리스트)
        setStocks(json.data || [])
      } catch (err) {
        console.error('holding error:', err)
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
      <Header title="보유 주식" />
      <Contents>
        {loading ? (
          <LoadingText>불러오는 중...</LoadingText>
        ) : hasStock ? (
          <StockCardBox>
            {stocks.map((stock, idx) => (
              <React.Fragment
                key={stock.ticker ?? stock.code ?? idx}
              >
                {/* TODO: StockCard가 기대하는 props 에 맞게 수정 */}
                <StockCard data={stock} />
                {idx !== stocks.length - 1 && <Line />}
              </React.Fragment>
            ))}
          </StockCardBox>
        ) : (
          <Nothing>
            <NothingIcon />
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
  width: 100%;
  max-width: 360px;
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #d1d1d1;
  flex-shrink: 0;
`

const Nothing = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;

  color: #b0b0b0;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

const LoadingText = styled.p`
  margin-top: 120px;
  color: #b0b0b0;
`