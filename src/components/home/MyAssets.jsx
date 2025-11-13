window.global = window;

import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import AssetDonut from '@/components/home/AssetDonut.jsx'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'

// 환경값
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const WS_BASE_URL = import.meta.env.VITE_PRICES_WS || 'wss://api.tomolow.store/ws'

const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}
const parseJwt = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}

function toSockJsUrl(base) {
  try {
    const u = new URL(base)
    if (u.pathname.endsWith('/ws')) u.pathname = u.pathname.replace(/\/ws$/, '/ws-sockjs')
    if (u.protocol === 'wss:') u.protocol = 'https:'
    if (u.protocol === 'ws:')  u.protocol = 'http:'
    return u.toString()
  } catch {
    return 'https://api.tomolow.store/ws-sockjs'
  }
}

const fmt = n => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '0'
  return n.toLocaleString('ko-KR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

const pct = n => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '0.00'
  return (n * 100).toFixed(2)
}

export default function MyAssets({ mode = 'personal', title = '내 자산 현황' }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [portfolio, setPortfolio] = useState({
    totalInvestment: 0,
    cashBalance: 0,
    totalCurrentValue: 0,
    totalPnlAmount: 0,
    totalPnlRate: 0,
  })
  const [items, setItems] = useState([])

  useEffect(() => {
    const load = async () => {
      if (!API_BASE_URL) { setError('서버 주소가 설정되어 있지 않습니다.'); setLoading(false); return }
      if (!getAccessToken()) { setError('로그인 후 이용 가능한 서비스입니다.'); setLoading(false); return }

      try {
        const res = await fetch(`${API_BASE_URL}/api/home/assets/my`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        })
        const text = await res.text()
        const json = text ? JSON.parse(text) : null
        console.log('/api/home/assets/my response >>>', json)

        if (!res.ok || !json?.success) {
          setError(json?.message || '자산 정보를 불러오지 못했습니다.')
          return
        }
        const data = json.data || {}
        setItems(Array.isArray(data.items) ? data.items : [])
        setPortfolio({
          totalInvestment: data.portfolio?.totalInvestment ?? 0,
          cashBalance: data.portfolio?.cashBalance ?? 0,
          totalCurrentValue: data.portfolio?.totalCurrentValue ?? 0,
          totalPnlAmount: data.portfolio?.totalPnlAmount ?? 0,
          totalPnlRate: data.portfolio?.totalPnlRate ?? 0,
        })
      } catch (e) {
        console.error('/api/home/assets/my error >>>', e)
        setError('서버 통신 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // 2) 실시간 구독 (STOMP over SockJS)
  const stompRef = useRef/** @type {React.MutableRefObject<Client|null>} */(null)
  const symbols = useMemo(() => items.map(i => i.symbol).filter(Boolean), [items])
  const userId = useMemo(() => {
    const t = getAccessToken()
    const jwt = t ? parseJwt(t) : null
    return jwt?.sub || jwt?.userId || null
  }, [])

  useEffect(() => {
    if (symbols.length === 0) return

    const sockUrl = toSockJsUrl(WS_BASE_URL)
    const client = new Client({
      webSocketFactory: () => new SockJS(sockUrl),
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
    })
    stompRef.current = client

    client.onConnect = () => {
      // 각 심볼 시세
      symbols.forEach((sym) => {
        client.subscribe(`/topic/ticker/${sym}`, (frame) => {
          try {
            const msg = JSON.parse(frame.body || '{}')
            setItems(prev =>
              prev.map(it =>
                it.symbol === msg.symbol
                  ? {
                      ...it,
                      currentPrice: typeof msg.currentPrice === 'number' ? msg.currentPrice : it.currentPrice,
                      pnlAmount:    typeof msg.pnlAmount    === 'number' ? msg.pnlAmount    : it.pnlAmount,
                      pnlRate:      typeof msg.pnlRate      === 'number' ? msg.pnlRate      : it.pnlRate,
                      imageUrl: msg.imageUrl ?? it.imageUrl,
                    }
                  : it
              )
            )
          } catch {}
        })
      })

      if (userId) {
        client.subscribe(`/topic/portfolio/${userId}`, (frame) => {
          try {
            const msg = JSON.parse(frame.body || '{}')
            setPortfolio(prev => ({
              ...prev,
              totalPnlAmount:    typeof msg.totalPnlAmount    === 'number' ? msg.totalPnlAmount    : prev.totalPnlAmount,
              totalPnlRate:      typeof msg.totalPnlRate      === 'number' ? msg.totalPnlRate      : prev.totalPnlRate,
              totalCurrentValue: typeof msg.totalCurrentValue === 'number' ? msg.totalCurrentValue : prev.totalCurrentValue,
            }))
          } catch {}
        })
      }
    }

    client.onStompError = () => {}
    client.onWebSocketError = () => {}
    client.activate()

    return () => { try { client.deactivate() } catch {} }
  }, [symbols.join('|'), userId])

  // 파생값
  const investAmount = portfolio.totalInvestment
  const cashAmount   = portfolio.cashBalance
  const totalAmount  = investAmount + cashAmount

  const profitAmount = portfolio.totalPnlAmount
  const profitRate   = portfolio.totalPnlRate
  const profitPositive = profitAmount >= 0
  const profitText = `${profitPositive ? '+' : ''}${fmt(profitAmount)}원(${profitPositive ? '+' : ''}${pct(profitRate)}%)`

  return (
    <Container mode={mode}>
      <SectionTitle>{title}</SectionTitle>

      {loading ? (
        <LoadingText>자산 정보를 불러오는 중이에요...</LoadingText>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <>
          <DonutBox>
            <AssetDonut investAmount={investAmount} cashAmount={cashAmount} />
            <CenterLabel>
              <CenterAsset>전체 자산</CenterAsset>
              <CenterValue>{fmt(totalAmount)}원</CenterValue>
            </CenterLabel>
          </DonutBox>

          <LegendRow>
            <LegendTop>
              <LegendItem>
                <LegendDot $color="#4880AF" />
                <LegendText>투자</LegendText>
              </LegendItem>
              <LegendValue>{fmt(investAmount)}원</LegendValue>
            </LegendTop>

            <LegendBottom>
              <LegendItem>
                <LegendDot $color="#E8EEF6" />
                <LegendText>현금</LegendText>
              </LegendItem>
              <LegendValue>{fmt(cashAmount)}원</LegendValue>
            </LegendBottom>
          </LegendRow>

          <Divider />

          <ProfitRow>
            <ProfitLabel>투자 손익</ProfitLabel>
            <ProfitValue $positive={profitPositive}>{profitText}</ProfitValue>
          </ProfitRow>
        </>
      )}
    </Container>
  )
}

const Container = styled.section`
  display: flex;
  flex-direction: column;
  background: var(--Neutral-0, #fff);
  align-items: flex-start;
  padding: ${({ mode }) =>
    mode === 'group'
      ? '16px var(--Grid-Margin, 16px) var(--Spacing-L, 16px) var(--Grid-Margin, 16px)'
      : '32px var(--Grid-Margin, 16px) var(--Spacing-L, 16px) var(--Grid-Margin, 16px)'};
  gap: var(--Spacing-L, 16px);
  align-self: stretch;
`
const SectionTitle = styled.h3`
  color: var(--Neutral-900, #2b5276);
  font-size: 20px;
  line-height: 28px;
  font-weight: 400;
  align-self: stretch;
`
const LoadingText = styled.p`
  font-size: 14px;
  color: #999;
  margin-top: 16px;
`
const ErrorText = styled.p`
  font-size: 14px;
  color: #ff2e4e;
  margin-top: 16px;
`
const DonutBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin: 8px 0 16px;
  width: 343px;
  height: 172px;
`
const CenterLabel = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`
const CenterAsset = styled.div`
  color: var(--Neutral-900, #333);
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
`
const CenterValue = styled.div`
  color: var(--Neutral-900, #333);
  font-size: 21px;
  font-weight: 600;
  line-height: 32px;
`
const LegendRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Spacing-S, 8px);
  align-self: stretch;
`
const LegendTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`
const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--Spacing-S, 8px);
`
const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ $color }) => $color};
`
const LegendText = styled.span`
  font-size: 14px;
  color: #555555;
`
const LegendBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`
const LegendValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
`
const Divider = styled.div`
  display: flex;
  width: 343px;
  height: 1px;
  padding: 0 0.4px;
  justify-content: center;
  align-items: center;
  background-color: var(--Neutral-200, #d1d1d1);
`
const ProfitRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`
const ProfitLabel = styled.span`
  color: var(--Neutral-600, #5d5d5d);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
const ProfitValue = styled.span`
  color: ${({ $positive }) => ($positive ? '#ff2e4e' : '#2B5276')};
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`