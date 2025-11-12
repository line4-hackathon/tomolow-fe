// src/components/home/HoldInterest.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import useSelect from '@/hooks/select'
import { useNavigate } from 'react-router-dom'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'
import rightArrow from '@/assets/icons/icon-right-arrow.svg'
import heartOn from '@/assets/icons/icon-heart-red.svg'
import heartOff from '@/assets/icons/icon-heart-gray.svg'
import heartBlue from '@/assets/icons/icon-heart-navy.svg'
import S from '@/components/home/HoldInterest.styled'
import useStockStore from '@/stores/stockStores'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const WS_BASE_URL = import.meta.env.VITE_PRICES_WS || 'wss://api.tomolow.store/ws'

// 유틸
const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}
const fmt = n => (typeof n === 'number' ? n.toLocaleString('ko-KR') : '0')
const safeSym = s => (s || '').trim().toUpperCase()

// ws/wss → http/https 변환
const toSockJsUrl = base => {
  try {
    const u = new URL(base)
    const secure = u.protocol === 'wss:'
    let path = u.pathname.replace(/\/ws$/, '/ws-sockjs')
    if (!path.endsWith('/ws-sockjs')) path = (path.endsWith('/') ? path : path + '/') + 'ws-sockjs'
    return `${secure ? 'https' : 'http'}://${u.host}${path}`
  } catch {
    return 'https://api.tomolow.store/ws-sockjs'
  }
}
async function fetchTickerOnce(symbol) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ticker/${encodeURIComponent(symbol)}`, {
      headers: { Accept: 'application/json', ...getAuthHeader() },
    })
    const txt = await res.text()
    const json = txt ? JSON.parse(txt) : null
    if (!res.ok || json?.success === false) return null

    const d = json.data || {}
    return {
      symbol: safeSym(symbol),
      currentPrice: d.currentPrice ?? d.price ?? d.tradePrice ?? 0,
      changeRate: d.pnlRate ?? d.changeRate ?? 0,
    }
  } catch {
    return null
  }
}

const TABS = [
  { key: 'hold', label: '보유' },
  { key: 'interest', label: '관심' },
]

export default function HoldInterest() {
  const { selectedMenu, handleSelect } = useSelect('hold')
  const navigate = useNavigate()
  const { setStockData } = useStockStore()

  const [holdingStocks, setHoldingStocks] = useState([])
  const [interestList, setInterestList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 데이터 초기 로드
  useEffect(() => {
    const load = async () => {
      if (!API_BASE_URL || !getAccessToken()) {
        setError('로그인 후 이용해주세요.')
        setLoading(false)
        return
      }

      try {
        const holdRes = await fetch(`${API_BASE_URL}/api/home/assets/my`, {
          headers: { Accept: 'application/json', ...getAuthHeader() },
        })
        const holdJson = await holdRes.json()
        if (holdRes.ok && holdJson?.success) {
          const items = holdJson.data?.items ?? []
          setHoldingStocks(items.map((it, i) => ({
            id: it.marketId ?? i,
            marketId: it.marketId,
            name: it.name,
            symbol: safeSym(it.symbol),
            quantity: it.quantity ?? 0,
            currentPrice: it.currentPrice ?? 0,
            changeRate: it.pnlRate ?? it.changeRate ?? 0,
            imageUrl: it.imageUrl ?? null,
          })))
        }

        // --- 관심 종목 불러오기 ---
        const intRes = await fetch(`${API_BASE_URL}/api/interests/markets`, {
          headers: { Accept: 'application/json', ...getAuthHeader() },
        })
        const intJson = await intRes.json()
        if (intRes.ok && intJson?.success) {
          const items = intJson.data?.items ?? []
          setInterestList(items.map((it, i) => ({
            id: it.marketId ?? i,
            marketId: it.marketId,
            name: it.name,
            symbol: safeSym(it.symbol),
            currentPrice: it.currentPrice ?? 0,
            changeRate: it.pnlRate ?? it.changeRate ?? 0,
            isLiked: true,
            imageUrl: it.imageUrl ?? null,
          })))
        }
      } catch {
        setError('데이터를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // WebSocket 실시간 반영
  const stompRef = useRef(null)
  const symbols = useMemo(() => {
    const s = new Set()
    holdingStocks.forEach(v => v.symbol && s.add(safeSym(v.symbol)))
    interestList.forEach(v => v.symbol && s.add(safeSym(v.symbol)))
    return Array.from(s)
  }, [holdingStocks, interestList])

  useEffect(() => {
    if (symbols.length === 0) return
    const sock = new SockJS(toSockJsUrl(WS_BASE_URL))
    const client = new Client({ webSocketFactory: () => sock, reconnectDelay: 3000 })
    stompRef.current = client

    client.onConnect = () => {
      symbols.forEach(sym => {
        client.subscribe(`/topic/ticker/${sym}`, (frame) => {
          try {
            const m = JSON.parse(frame.body || '{}')
            const ms = safeSym(m?.symbol)
            if (!ms) return

            const price = m.currentPrice ?? m.price ?? m.tradePrice ?? null
            const rate = m.pnlRate ?? m.changeRate ?? null

            setHoldingStocks(prev => prev.map(it =>
              safeSym(it.symbol) === ms
                ? { ...it, currentPrice: price ?? it.currentPrice, changeRate: rate ?? it.changeRate }
                : it
            ))

            setInterestList(prev => prev.map(it =>
              safeSym(it.symbol) === ms
                ? { ...it, currentPrice: price ?? it.currentPrice, changeRate: rate ?? it.changeRate }
                : it
            ))
          } catch {}
        })
      })
    }

    client.activate()
    return () => client.deactivate()
  }, [symbols.join('|')])

  // navigate (store 기반)
  const handleGoTrading = (stock) => {
    setStockData(stock)
    navigate('/invest/trading')
  }

  // 관심 토글
  const toggleLike = async (marketId) => {
    try {
      await fetch(`${API_BASE_URL}/api/interests/markets/${marketId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      })
      setInterestList(cur =>
        cur.map(s => (s.marketId === marketId ? { ...s, isLiked: !s.isLiked } : s))
      )
    } catch (err) {
      console.error('관심 토글 실패', err)
    }
  }

  // 렌더링
  const isHoldTab = selectedMenu === 'hold'
  const list = isHoldTab ? holdingStocks : interestList

  return (
    <S.Container>
      {/* 머니 충전 버튼 */}
      <S.MoneyCharge onClick={() => navigate('/mypage/charge')} style={{ cursor: 'pointer' }}>
        <S.LeftBox>
          <S.IconBox />
          <S.Label>머니 충전</S.Label>
        </S.LeftBox>
        <S.RightBox>
          <S.Arrow src={rightArrow} alt="이동 아이콘" />
        </S.RightBox>
      </S.MoneyCharge>

      {/* 탭 선택 */}
      <S.TabRow>
        {TABS.map(tab => (
          <S.TabButton
            key={tab.key}
            $active={selectedMenu === tab.key}
            onClick={() => handleSelect(tab.key)}
          >
            {tab.label}
          </S.TabButton>
        ))}
      </S.TabRow>

      {/* 데이터 렌더링 */}
      {loading ? (
        <S.Message>불러오는 중...</S.Message>
      ) : error ? (
        <S.Message style={{ color: '#ff2e4e' }}>{error}</S.Message>
      ) : list.length ? (
        <S.CardList>
          {list.map(stock =>
            isHoldTab ? (
              <S.HoldCard
                key={`${stock.id}-${stock.symbol}`}
                onClick={() => handleGoTrading(stock)}
              >
                <S.Left>
                  <S.Thumbnail />
                  <S.LeftText>
                    <S.StockName>{stock.name}</S.StockName>
                    <S.StockSub>{stock.quantity ?? 0}주</S.StockSub>
                  </S.LeftText>
                </S.Left>
                <S.HoldRight>
                  <S.Price>
                    {fmt(stock.currentPrice)}원
                    <S.Diff $positive={(stock.changeRate ?? 0) >= 0}>
                      {((stock.changeRate ?? 0) * 100).toFixed(2)}%
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
                  <S.Thumbnail />
                  <S.LeftText>
                    <S.StockName>{stock.name}</S.StockName>
                    <S.LeftBtnText>
                      <S.StockSub>{stock.symbol}</S.StockSub>
                      <S.InterestPriceRow>
                        <S.InterestPrice $positive={(stock.changeRate ?? 0) >= 0}>
                          {fmt(stock.currentPrice)}원 ({((stock.changeRate ?? 0) * 100).toFixed(2)}%)
                        </S.InterestPrice>
                      </S.InterestPriceRow>
                    </S.LeftBtnText>
                  </S.LeftText>
                </S.Left>
                <S.InterestRight onClick={(e) => e.stopPropagation()}>
                  <S.HeartButton onClick={() => toggleLike(stock.marketId)}>
                    <S.HeartIcon src={stock.isLiked ? heartOn : heartOff} alt="하트" />
                  </S.HeartButton>
                </S.InterestRight>
              </S.InterestCard>
            )
          )}
        </S.CardList>
      ) : (
        <S.EmptyState>
          {isHoldTab ? (
            <>
              <S.EmptyText>아직 보유한 주식이 없습니다</S.EmptyText>
              <S.InvestButton onClick={() => navigate('/invest/search')}>
                투자하기
              </S.InvestButton>
            </>
          ) : (
            <>
              <S.HeartEmpty src={heartBlue} alt="빈 하트" />
              <S.EmptyText>관심 주식이 없어요</S.EmptyText>
            </>
          )}
        </S.EmptyState>
      )}
    </S.Container>
  )
}