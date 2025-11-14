// src/pages/invest/SearchPage.jsx
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'

import useSelect from '@/hooks/select'
import { menuTypes } from './selectType'
import { APIService } from './api'
import { useType } from '@/contexts/TypeContext'

import StockCard from '@/components/invest/stockCard'
import SearchBar from '@/components/common/searchBar'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'
import NothingIcon from '@/assets/icons/icon-search-not.svg?react'
import NothingHeart from '@/assets/icons/icon-heart-navy.svg?react'
import LoadingImage from '@/assets/images/image-loading.svg?react'

const WS_BASE_URL = import.meta.env.VITE_PRICES_WS || 'wss://api.tomolow.store/ws'

// /ws → /ws-sockjs, ws → http(s)
const toSockJsUrl = base => {
  try {
    const u = new URL(base)
    if (u.pathname.endsWith('/ws')) u.pathname = u.pathname.replace(/\/ws$/, '/ws-sockjs')
    if (u.protocol === 'wss:') u.protocol = 'https:'
    if (u.protocol === 'ws:') u.protocol = 'http:'
    return u.toString()
  } catch {
    return 'https://api.tomolow.store/ws-sockjs'
  }
}

// 공통: 응답을 StockCard용 형태로 변환
const normalizeItem = raw => ({
  ...raw,
  price: raw.price ?? raw.currentPrice ?? raw.tradePrice ?? 0,
  changeRate: raw.changeRate ?? 0,
  imageUrl: raw.imageUrl ?? raw.imgUrl ?? null,
})

export default function InvestSearchPage() {
  const { selectedMenu, handleSelect } = useSelect('TRADING_AMOUNT')
  const [stockData, setStockData] = useState()
  const [searchName, setSearchName] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [interestSet, setInterestSet] = useState(() => new Set()) // ★ 관심 symbol Set
  const type = useType()

  /* 0) 전체 관심 목록 한 번 가져와서 Set으로 저장 */
  useEffect(() => {
    let alive = true
    const fetchInterestsForSet = async () => {
      try {
        const res = await APIService.private.get('/api/interests/markets')
        if (!alive) return
        const items = res.data?.items ?? res.data?.data?.items ?? []
        const s = new Set(items.map(it => it.symbol)) // symbol 기준
        setInterestSet(s)
      } catch (e) {
        console.log('초기 관심 세트 로드 실패', e)
      }
    }
    fetchInterestsForSet()
    return () => {
      alive = false
    }
  }, [])

  /* 1) 검색어 디바운싱 */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchName), 800)
    return () => clearTimeout(t)
  }, [searchName])

  /* 2) 검색 API (검색어 있을 때만) */
  useEffect(() => {
    if (!debouncedSearch) return

    let alive = true
    const fetchSearch = async () => {
      try {
        const res = await APIService.private.get('/api/search', {
          params: { query: debouncedSearch },
        })
        if (!alive) return
        const raw = Array.isArray(res.data)
          ? res.data
          : res.data.items ?? res.data.results ?? []
        const mapped = raw.map(item => ({
          ...normalizeItem(item),
          interested: interestSet.has(item.symbol), // ★ 관심 여부 반영
        }))
        setStockData(mapped)
      } catch (e) {
        console.log('검색어 조회 실패', e)
      }
    }
    fetchSearch()
    return () => {
      alive = false
    }
  }, [debouncedSearch, interestSet])

  /* 3) 관심 탭: /api/interests/markets */
  useEffect(() => {
    if (debouncedSearch) return
    if (selectedMenu !== 'INTEREST') return

    let alive = true
    const fetchInterestList = async () => {
      try {
        const res = await APIService.private.get('/api/interests/markets')
        if (!alive) return
        const rawItems = res.data?.items ?? res.data?.data?.items ?? []
        const mapped = rawItems.map(item => ({
          ...normalizeItem(item),
          interested: true, // 관심 탭이니까 무조건 true
        }))
        setStockData(mapped)
      } catch (e) {
        console.log('관심 주식 조회 실패', e)
      }
    }
    fetchInterestList()
    return () => {
      alive = false
    }
  }, [selectedMenu, debouncedSearch])

  /* 4) 랭킹 탭: 웹소켓 (검색 X + INTEREST 아님) */
  useEffect(() => {
    if (debouncedSearch) return
    if (selectedMenu === 'INTEREST') return

    let topic = null
    switch (selectedMenu) {
      case 'TRADING_AMOUNT':
        topic = '/topic/rank/turnover'
        break
      case 'TRADING_VOLUME':
        topic = '/topic/rank/volume'
        break
      case 'SOARING':
        topic = '/topic/rank/gainers'
        break
      case 'PLUMMETING':
        topic = '/topic/rank/losers'
        break
      default:
        topic = null
    }
    if (!topic) return

    const sockUrl = toSockJsUrl(WS_BASE_URL)
    const client = new Client({
      webSocketFactory: () => new SockJS(sockUrl),
      reconnectDelay: 5000,
      debug: () => {},
    })

    client.onConnect = () => {
      client.subscribe(topic, msg => {
        try {
          const body = msg.body ? JSON.parse(msg.body) : {}
          const raw = Array.isArray(body) ? body : body.items ?? body.data ?? []
          const mapped = raw.map(item => ({
            ...normalizeItem(item),
            interested: interestSet.has(item.symbol), // ★ 관심이면 하트 ON
          }))
          setStockData(mapped)
        } catch (e) {
          console.error('WS JSON parse error', e)
        }
      })
    }

    client.onStompError = frame => {
      console.error('STOMP ERROR', frame)
    }

    client.activate()
    return () => {
      client.deactivate()
    }
  }, [selectedMenu, debouncedSearch, interestSet])

  /* 5) 관심 Set이 바뀌었을 때 현재 리스트도 하트만 다시 맞춰주기 */
  useEffect(() => {
    setStockData(prev =>
      prev?.map(item => ({
        ...item,
        interested: interestSet.has(item.symbol),
      })) ?? prev,
    )
  }, [interestSet])

  /* 6) UI 분기 */
  let stockUI
  if (!stockData) {
    stockUI = <LoadingImage />
  } else if (stockData.length > 0) {
    stockUI = (
      <StockCardBox>
        {stockData.map((data, index) => (
          <div
            key={data.marketId ?? data.symbol ?? data.name ?? index}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <StockCard data={data} />
            {index < stockData.length - 1 && <Line />}
          </div>
        ))}
      </StockCardBox>
    )
  } else {
    stockUI = (
      <Nothing>
        {selectedMenu === 'INTEREST' ? (
          <>
            <NothingHeart />
            <p>관심 자산이 없어요</p>
          </>
        ) : (
          <>
            <NothingIcon />
            <p>검색된 자산이 없어요</p>
          </>
        )}
      </Nothing>
    )
  }

  return (
    <Page>
      <Header title="투자" showIcon={type === 'group'} path={-1} />
      <Contents>
        <SearchBar
          explain="원하는 자산을 검색하세요"
          searchName={searchName}
          setSearchName={setSearchName}
        />

        {!debouncedSearch && (
          <ListBox>
            {Object.keys(menuTypes).map(key => (
              <List
                key={key}
                onClick={() => handleSelect(key)}
                $isMenu={selectedMenu === key}
              >
                {menuTypes[key]}
              </List>
            ))}
          </ListBox>
        )}

        {stockUI}
      </Contents>
      <MenuBar />
    </Page>
  )
}

/* styled-components */

const Page = styled.div``

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  align-items: center;
  margin-top: 32px;
  gap: 32px;
`

const ListBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`

const List = styled.div`
  color: ${({ $isMenu }) => ($isMenu ? '#2B5276' : '#B0B0B0')};
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  border-bottom: ${({ $isMenu }) => ($isMenu ? '1px solid #2B5276' : 'none')};
  padding-bottom: var(--Spacing-S, 8px);
  &:hover {
    cursor: pointer;
  }
`

const StockCardBox = styled.div`
  height: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 35px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background: var(--Neutral-200, #d1d1d1);
  flex-shrink: 0;
`

const Nothing = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`