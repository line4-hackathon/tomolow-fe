// src/components/home/HoldInterest.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'

import useSelect from '@/hooks/select'
import useStockStore from '@/stores/stockStores'
import S from '@/components/home/HoldInterest.styled'

import rightArrow from '@/assets/icons/icon-right-arrow.svg'
import heartOn from '@/assets/icons/icon-heart-red.svg'
import heartOff from '@/assets/icons/icon-heart-gray.svg'
import heartBlue from '@/assets/icons/icon-heart-navy.svg'
import moneycharge from '@/assets/icons/icon-money-recharge.svg'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const WS_BASE_URL = import.meta.env.VITE_PRICES_WS || 'wss://api.tomolow.store/ws'

const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

const fmt = n => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '0'
  return Math.round(n).toLocaleString('ko-KR')
}

const safeSym = s => (s || '').trim().toUpperCase()

// ws → sockjs url 변환
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

const TABS = [
  { key: 'hold', label: '보유' },
  { key: 'interest', label: '관심' },
]

export default function HoldInterest() {
  const navigate = useNavigate()
  const { selectedMenu, handleSelect } = useSelect('hold')
  const { setStockData } = useStockStore()

  const [holdingStocks, setHoldingStocks] = useState([])
  const [interestList, setInterestList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const stompRef = useRef(null)

  // 1) 초기 데이터 로드 (백엔드 값 그대로 매핑)
  useEffect(() => {
    const load = async () => {
      if (!API_BASE_URL) {
        setError('서버 주소가 설정되어 있지 않습니다.')
        setLoading(false)
        return
      }
      if (!getAccessToken()) {
        setError('로그인 후 이용 가능한 서비스입니다.')
        setLoading(false)
        return
      }

      try {
        const [holdRes, intRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/home/assets/my`, {
            headers: { Accept: 'application/json', ...getAuthHeader() },
          }),
          fetch(`${API_BASE_URL}/api/interests/markets`, {
            headers: { Accept: 'application/json', ...getAuthHeader() },
          }),
        ])

        // 보유
        if (holdRes.ok) {
          const json = await holdRes.json()
          if (json?.success) {
            const items = json.data?.items ?? []
            setHoldingStocks(
              items.map((it, i) => ({
                id: it.marketId ?? i,
                market: it.market ?? '',
                marketId: it.marketId,
                marketName: it.marketName ?? '',
                name: it.name,
                symbol: safeSym(it.symbol),
                price: it.currentPrice ?? it.price ?? it.tradePrice ?? 0,
                changeRate: it.pnlRate ?? it.changeRate ?? 0,
                pnlAmount: typeof it.pnlAmount === 'number' ? it.pnlAmount : 0,
                prevClose: it.prevClose ?? 0,
                accVolume: it.accVolume ?? 0,
                accTradePrice24h: it.accTradePrice24h ?? 0,
                tradeTimestamp: it.tradeTimestamp ?? null,
                interested: true,
                quantity: it.quantity ?? 0,
                imageUrl: it.imageUrl ?? null,
              })),
            )
          }
        }

        // 관심
        if (intRes.ok) {
          const json = await intRes.json()
          if (json?.success) {
            const items = json.data?.items ?? []
            setInterestList(
              items.map((it, i) => ({
                id: it.marketId ?? i,
                market: it.market ?? '',
                marketId: it.marketId,
                marketName: it.marketName ?? '',
                name: it.name,
                symbol: safeSym(it.symbol),
                price: it.currentPrice ?? it.price ?? it.tradePrice ?? 0,
                changeRate: it.pnlRate ?? it.changeRate ?? 0,
                pnlAmount: typeof it.pnlAmount === 'number' ? it.pnlAmount : 0,
                prevClose: it.prevClose ?? 0,
                accVolume: it.accVolume ?? 0,
                accTradePrice24h: it.accTradePrice24h ?? 0,
                tradeTimestamp: it.tradeTimestamp ?? null,
                interested: it.interested ?? true,
                imageUrl: it.imageUrl ?? null,
                isLiked: true,
              })),
            )
          }
        }
      } catch (e) {
        console.error('home hold/interest load error >>>', e)
        setError('데이터를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // 2) 실시간 심볼 리스트
  const symbols = useMemo(() => {
    const s = new Set()
    holdingStocks.forEach((v) => v.symbol && s.add(safeSym(v.symbol)))
    interestList.forEach((v) => v.symbol && s.add(safeSym(v.symbol)))
    return Array.from(s)
  }, [holdingStocks, interestList])

  // 3) WebSocket
  useEffect(() => {
    if (symbols.length === 0) return

    const sockUrl = toSockJsUrl(WS_BASE_URL)
    const client = new Client({
      webSocketFactory: () => new SockJS(sockUrl),
      reconnectDelay: 3000,
      debug: () => {},
    })

    stompRef.current = client

    client.onConnect = () => {
      symbols.forEach(sym => {
        const upperSym = safeSym(sym)
        const topic = `/topic/ticker/${upperSym}`

        client.subscribe(topic, frame => {
          try {
            const msg = JSON.parse(frame.body || '{}')

            const rawPrice =
              msg.tradePrice ?? msg.currentPrice ?? msg.price ?? msg.lastPrice
            const price =
              typeof rawPrice === 'number' ? rawPrice : Number(rawPrice)

            const rawRate = msg.pnlRate ?? msg.changeRate
            const rate =
              typeof rawRate === 'number' ? rawRate : Number(rawRate)

            const rawPnl = msg.pnlAmount
            const pnlAmount =
              typeof rawPnl === 'number' ? rawPnl : Number(rawPnl)

            // 보유
            setHoldingStocks(prev =>
              prev.map(it =>
                safeSym(it.symbol) === upperSym
                  ? {
                      ...it,
                      price: Number.isFinite(price) ? price : it.price,
                      changeRate: Number.isFinite(rate)
                        ? rate
                        : it.changeRate,
                      pnlAmount: Number.isFinite(pnlAmount)
                        ? pnlAmount
                        : it.pnlAmount,
                    }
                  : it,
              ),
            )

            // 관심
            setInterestList(prev =>
              prev.map(it =>
                safeSym(it.symbol) === upperSym
                  ? {
                      ...it,
                      price: Number.isFinite(price) ? price : it.price,
                      changeRate: Number.isFinite(rate)
                        ? rate
                        : it.changeRate,
                      pnlAmount: Number.isFinite(pnlAmount)
                        ? pnlAmount
                        : it.pnlAmount,
                    }
                  : it,
              ),
            )
          } catch (e) {
            console.error('ticker frame parse error >>>', e)
          }
        })
      })
    }

    client.onStompError = (f) => {
      console.error('STOMP error >>>', f)
    }

    client.activate()

    return () => {
      try {
        client.deactivate()
      } catch {}
    }
  }, [JSON.stringify(symbols)])

  // 4) 트레이딩 페이지로 이동
  const handleGoTrading = (stock) => {
    if (!stock) return
    setStockData(stock)
    navigate('/invest/trading')
  }

  // 5) 관심 토글
  const toggleLike = async (marketId) => {
    if (!API_BASE_URL) return
    try {
      await fetch(`${API_BASE_URL}/api/interests/markets/${marketId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      })
      setInterestList((cur) =>
        cur.map((s) => (s.marketId === marketId ? { ...s, isLiked: !s.isLiked } : s)),
      )
    } catch (err) {
      console.error('관심 토글 실패 >>>', err)
    }
  }

  // 6) 렌더링
  const isHoldTab = selectedMenu === 'hold'
  const list = isHoldTab
    ? holdingStocks.filter(item => (item.quantity ?? 0) > 0)
    : interestList

  return (
    <S.Container>
      <S.MoneyCharge onClick={() => navigate('/mypage/charge')} style={{ cursor: 'pointer' }}>
        <S.LeftBox>
          <S.MoneyIcon src={moneycharge} alt="머니 충전 아이콘" />
          <S.Label>머니 충전</S.Label>
        </S.LeftBox>
        <S.RightBox>
          <S.Arrow src={rightArrow} alt='이동 아이콘' />
        </S.RightBox>
      </S.MoneyCharge>

      <S.TabRow>
        {TABS.map((tab) => (
          <S.TabButton
            key={tab.key}
            $active={selectedMenu === tab.key}
            onClick={() => handleSelect(tab.key)}
          >
            {tab.label}
          </S.TabButton>
        ))}
      </S.TabRow>

      {loading ? (
        <S.Message>불러오는 중...</S.Message>
      ) : error ? (
        <S.Message style={{ color: '#ff2e4e' }}>{error}</S.Message>
      ) : list.length ? (
        <S.CardList>
          {list.map((stock) =>
            isHoldTab ? (
              <S.HoldCard
                key={`${stock.id}-${stock.symbol}`}
                onClick={() => handleGoTrading(stock)}
              >
                <S.Left>
                  <S.Thumbnail $src={stock.imageUrl} />
                  <S.LeftText>
                    <S.StockName>{stock.name}</S.StockName>
                    <S.StockSub>{stock.quantity ?? 0}주</S.StockSub>
                  </S.LeftText>
                </S.Left>
                <S.HoldRight>
                  <S.Price>
                    {fmt(stock.price)}원
                    <S.Diff $positive={(stock.changeRate ?? 0) >= 0}>
                      {fmt(stock.pnlAmount)}원(
                      {((stock.changeRate ?? 0) * 100).toFixed(2)}%)
                    </S.Diff>
                  </S.Price>
                </S.HoldRight>
              </S.HoldCard>
            ) : (
              <S.InterestCard
                key={`${stock.id}-${stock.symbol}`}
                onClick={() => handleGoTrading(stock)}
              >
                <S.Left>
                  <S.Thumbnail $src={stock.imageUrl} />
                  <S.LeftText>
                    <S.StockName>{stock.name}</S.StockName>
                    <S.LeftBtnText>
                      <S.StockSub>{stock.symbol}</S.StockSub>
                      <S.InterestPriceRow>
                        <S.InterestPrice
                          $positive={(stock.changeRate ?? 0) >= 0}
                        >
                          {fmt(stock.price)}원 (
                          {((stock.changeRate ?? 0) * 100).toFixed(2)}%)
                        </S.InterestPrice>
                      </S.InterestPriceRow>
                    </S.LeftBtnText>
                  </S.LeftText>
                </S.Left>
                <S.InterestRight
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <S.HeartButton onClick={() => toggleLike(stock.marketId)}>
                    <S.HeartIcon src={stock.isLiked ? heartOn : heartOff} alt='하트' />
                  </S.HeartButton>
                </S.InterestRight>
              </S.InterestCard>
            ),
          )}
        </S.CardList>
      ) : (
        <S.EmptyState>
          {isHoldTab ? (
            <>
              <S.EmptyText>아직 보유한 자산이 없습니다</S.EmptyText>
              <S.InvestButton onClick={() => navigate('/invest/search')}>투자하기</S.InvestButton>
            </>
          ) : (
            <>
              <S.HeartEmpty src={heartBlue} alt="빈 하트" />
              <S.EmptyText>관심 자산이 없어요</S.EmptyText>
            </>
          )}
        </S.EmptyState>
      )}
    </S.Container>
  )
}
