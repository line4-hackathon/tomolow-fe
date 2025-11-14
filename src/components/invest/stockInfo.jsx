import React, { useEffect, useRef, useState } from 'react'
import useStockStore from '@/stores/stockStores'
import styled from 'styled-components'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'

const WS_BASE_URL = import.meta.env.VITE_PRICES_WS || 'wss://api.tomolow.store/ws'

const safeSym = s => (s || '').trim().toUpperCase()

const toSockJsUrl = base => {
  try {
    const u = new URL(base)
    if (u.pathname.endsWith('/ws')) {
      u.pathname = u.pathname.replace(/\/ws$/, '/ws-sockjs')
    }
    if (u.protocol === 'wss:') u.protocol = 'https:'
    if (u.protocol === 'ws:') u.protocol = 'http:'
    return u.toString()
  } catch {
    return 'https://api.tomolow.store/ws-sockjs'
  }
}

export default function StockInfo() {
  const { stockData } = useStockStore()

  // 실시간 표시용 로컬 상태
  const [price, setPrice] = useState(stockData.price ?? 0)
  const [changePrice, setChangePrice] = useState(stockData.changePrice ?? 0)

  const stompRef = useRef(null)

  // stockData가 변경될 때 기본값 동기화
  useEffect(() => {
    setPrice(stockData.price ?? 0)
    setChangePrice(stockData.changePrice ?? 0)
  }, [stockData.price, stockData.changePrice, stockData.symbol])

  // WebSocket 구독
  useEffect(() => {
    const symbol = safeSym(stockData.symbol || stockData.market)
    if (!symbol || !WS_BASE_URL) return

    const sockUrl = toSockJsUrl(WS_BASE_URL)
    const client = new Client({
      webSocketFactory: () => new SockJS(sockUrl),
      reconnectDelay: 3000,
      debug: () => {},
    })
    stompRef.current = client

    client.onConnect = () => {
      const topic = `/topic/ticker/${symbol}`

      client.subscribe(topic, frame => {
        try {
          const msg = JSON.parse(frame.body || '{}')

          const rawPrice =
            msg.tradePrice ?? msg.currentPrice ?? msg.price ?? msg.lastPrice
          const newPrice =
            typeof rawPrice === 'number' ? rawPrice : Number(rawPrice)

          const rawChangePrice = msg.changePrice
          const newChangePrice =
            typeof rawChangePrice === 'number'
              ? rawChangePrice
              : Number(rawChangePrice)

          if (Number.isFinite(newPrice)) setPrice(newPrice)
          if (Number.isFinite(newChangePrice)) setChangePrice(newChangePrice)
        } catch (e) {
          console.error('StockInfo ticker parse error >>>', e)
        }
      })
    }

    client.onStompError = f => {
      console.error('StockInfo STOMP error >>>', f)
    }

    client.activate()

    return () => {
      try {
        client.deactivate()
      } catch {}
    }
  }, [stockData.symbol, stockData.market])

  const priceText = price.toLocaleString('ko-KR')
  const changeSign = changePrice >= 0 ? '+' : ''
  const changeText = `${changeSign}${changePrice.toLocaleString('ko-KR')}`

  return (
    <Box>
      <Stock $fontSize="20px">{stockData.name}</Stock>
      <Stock $fontSize="24px">{priceText}원</Stock>
      <Yesterday>
        어제보다{' '}
        <span style={{ color: '#FF2E4E' }}>{changeText}원</span>
      </Yesterday>
      <MoveAverage>
        이동평균선 <a style={{ color: '#57B789' }}>5 </a>
        <a style={{ color: '#FF2E4E' }}>20 </a>
        <a style={{ color: '#FB9F4D' }}>60 </a>
        120
      </MoveAverage>
    </Box>
  )
}

// 스타일은 그대로

const Box = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 16px;
  width: 359px;
`
const Stock = styled.div`
  color: var(--Neutral-900, #333);
  font-family: Inter;
  font-size: ${({ $fontSize }) => $fontSize};
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
`
const Yesterday = styled.div`
  color: ${({ $fontColor }) => $fontColor};
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`
const MoveAverage = styled.div`
  font-family: Inter;
  font-size: 8px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
`