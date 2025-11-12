import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import useSelect from '@/hooks/select'
import { useNavigate } from 'react-router-dom'
import rightArrow from '@/assets/icons/icon-right-arrow.svg'
import heartOn from '@/assets/icons/icon-heart-red.svg'
import heartOff from '@/assets/icons/icon-heart-gray.svg'
import heartBlue from '@/assets/icons/icon-heart-navy.svg'
import moneycharge from '@/assets/icons/icon-charge.svg'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const getAccessToken = () => localStorage.getItem('accessToken')
const getAuthHeader = () => {
  const t = getAccessToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

const TABS = [
  { key: 'hold', label: '보유' },
  { key: 'interest', label: '관심' },
]

function HoldInterest() {
  const { selectedMenu, handleSelect } = useSelect('hold')
  const navigate = useNavigate()

  const [holdingStocks, setHoldingStocks] = useState([])
  const [interestList, setInterestList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!API_BASE_URL) { setError('서버 주소가 설정되어 있지 않습니다.'); setLoading(false); return }
      if (!getAccessToken()) { setError('로그인 후 이용 가능한 서비스입니다.'); setLoading(false); return }

      try {
        // 1) 보유 종목 + 포트폴리오 (통합 API)
        const res = await fetch(`${API_BASE_URL}/api/home/assets/my`, {
          method: 'GET',
          headers: { Accept: 'application/json', ...getAuthHeader() },
        })
        const raw = await res.text()
        let json = {}
        try { json = raw ? JSON.parse(raw) : {} } catch { /* 서버가 HTML 던질 경우 대비 */ }

        if (!res.ok || json.success === false) {
          setError(json?.message || raw || '보유 종목 정보를 불러오지 못했습니다.')
        } else {
          const items = Array.isArray(json?.data?.items) ? json.data.items : []
          const mappedHoldings = items.map((it, idx) => ({
            id: it.marketId ?? idx,
            marketId: it.marketId,
            name: it.name,
            symbol: it.symbol,
            quantity: it.quantity ?? 0,
            price: it.currentPrice ?? 0,                        // 현재가
            // 손익률 표시
            diffText: typeof it.pnlRate === 'number'
              ? `${it.pnlRate >= 0 ? '+' : ''}${(it.pnlRate * 100).toFixed(2)}%`
              : '0.00%',
            // 필요하면 화면 확장 용
            pnlAmount: it.pnlAmount ?? 0,
            imageUrl: it.imageUrl || null,
          }))
          setHoldingStocks(mappedHoldings)
        }

        // 2) 관심 목록
        const interestRes = await fetch(`${API_BASE_URL}/api/interests/markets`, {
          method: 'GET',
          headers: { Accept: 'application/json', ...getAuthHeader() },
        })
        const interestRaw = await interestRes.text()
        let interestJson = {}
        try { interestJson = interestRaw ? JSON.parse(interestRaw) : {} } catch {}

        if (interestRes.ok && interestJson.success) {
          const items = Array.isArray(interestJson?.data?.items) ? interestJson.data.items : []
          const mappedInterests = items.map((it, idx) => ({
            id: it.marketId ?? idx,
            marketId: it.marketId,
            name: it.name,
            code: it.symbol,
            // 관심 목록 API에는 가격/손익이 없으므로 0으로 채움 (추후 실시간 구독시 업데이트)
            price: 0,
            diffText: '0.00%',
            isLiked: true,
            imageUrl: it.imageUrl || null,
          }))
          setInterestList(mappedInterests)
        } // 실패해도 보유 탭은 보여줄 수 있으니 error는 따로 띄우지 않음
      } catch (e) {
        console.error('HoldInterest fetch error >>>', e)
        setError('서버 통신 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const isHoldTab = selectedMenu === 'hold'
  const list = (isHoldTab ? holdingStocks : interestList) || []
  const hasItems = Array.isArray(list) && list.length > 0

  const handleInvestClick = () => navigate('/invest')
  const handleMoneyChargeClick = () => navigate('/mypage/charge')

  // 관심 토글
  const toggleLike = async (marketId) => {
    setError('')
    const prev = interestList
    setInterestList(cur =>
      cur.map(s => (s.marketId ?? s.id) === marketId ? { ...s, isLiked: !s.isLiked } : s)
    )

    try {
      const res = await fetch(`${API_BASE_URL}/api/interests/markets/${marketId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      })
      const raw = await res.text()
      let json = {}
      try { json = raw ? JSON.parse(raw) : {} } catch {}

      if (!res.ok || json.success === false) {
        setInterestList(prev) // 롤백
        if (res.status === 401 || res.status === 403) setError('로그인이 만료되었거나 권한이 없습니다.')
        else setError(json?.message || raw || '관심 종목 설정에 실패했습니다.')
        return
      }

      const interested = json?.data?.interested
      if (typeof interested === 'boolean') {
        setInterestList(cur =>
          cur.map(s => (s.marketId ?? s.id) === marketId ? { ...s, isLiked: interested } : s)
        )
      }
    } catch (e) {
      console.error('toggleLike exception >>>', e)
      setInterestList(prev) // 롤백
      setError('서버 통신 중 오류가 발생했습니다.')
    }
  }

  return (
    <Container>
      <MoneyCharge onClick={handleMoneyChargeClick}>
        <LeftBox>
          <img src={moneycharge} alt="머니 충전 아이콘" />
          <Label>머니 충전</Label>
        </LeftBox>
        <RightBox><Arrow src={rightArrow} alt="이동 아이콘" /></RightBox>
      </MoneyCharge>

      <TabRow>
        {TABS.map(tab => (
          <TabButton key={tab.key} $active={selectedMenu === tab.key} onClick={() => handleSelect(tab.key)}>
            {tab.label}
          </TabButton>
        ))}
      </TabRow>

      {loading ? (
        <Message>보유/관심 종목을 불러오는 중이에요...</Message>
      ) : error ? (
        <Message>{error}</Message>
      ) : hasItems ? (
        <CardList>
          {list.map(stock => (
            <Card key={`${stock.id}-${stock.symbol || stock.code || ''}`}>
              <Left>
                <Thumbnail />
                <LeftText>
                  <StockName>{stock.name}</StockName>
                  {isHoldTab ? (
                    <StockSub>{stock.quantity}주</StockSub>
                  ) : (
                    <StockSub>{stock.code}</StockSub>
                  )}
                </LeftText>
              </Left>

              <Right>
                <Price>
                  {Number(stock.price || 0).toLocaleString('ko-KR')}원
                  <Diff $positive={String(stock.diffText).startsWith('+')}>
                    {stock.diffText}
                  </Diff>
                </Price>

                {!isHoldTab && (
                  <HeartButton onClick={() => toggleLike(stock.marketId ?? stock.id)}>
                    <HeartIcon src={stock.isLiked ? heartOn : heartOff} alt="좋아요 아이콘" />
                  </HeartButton>
                )}
              </Right>
            </Card>
          ))}
        </CardList>
      ) : (
        <EmptyState>
          {isHoldTab ? (
            <>
              <EmptyText>아직 주식에 투자하지 않으셨네요</EmptyText>
              <InvestButton onClick={handleInvestClick}>투자하기</InvestButton>
            </>
          ) : (
            <>
              <HeartEmpty src={heartBlue} alt="빈 하트" />
              <EmptyText>관심 주식이 없어요</EmptyText>
            </>
          )}
        </EmptyState>
      )}
    </Container>
  )
}

export default HoldInterest

const Container = styled.section`
  padding: 24px 16px 32px;
  background-color: #f6f6f6;
`

const MoneyCharge = styled.div`
  display: flex;
  padding: 24px 7px 24px 16px;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  cursor: pointer;
`

const LeftBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Label = styled.div`
  color: #333;
  font-size: 16px;
  font-weight: 500;
`

const RightBox = styled.div`
  width: 24px;
  height: 24px;
`

const Arrow = styled.img`
  width: 16px;
  height: 16px;
`

const TabRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
`

const TabButton = styled.button`
  border: none;
  background: transparent;
  padding: 0 0 8px;
  font-size: 20px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#2B5276' : '#B0B0B0')};
  border-bottom: ${({ $active }) =>
    $active ? '1px solid #1f3b70' : '1px solid transparent'};
`

const Message = styled.div`
  padding: 40px 0 24px;
  text-align: center;
  color: #b0b0b0;
`

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Thumbnail = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #263c54;
`

const LeftText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const StockName = styled.div`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`

const StockSub = styled.div`
  font-size: 12px;
  color: #6d6d6d;
`

const Right = styled.div`
  display: flex;
  gap: 24px;
`

const Price = styled.div`
  color: var(--Neutral-900, #333);
  text-align: right;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  gap: 8px;
  display: flex;
  flex-direction: column;
`

const Diff = styled.div`
  font-size: 12px;
  text-align: right;
  font-weight: 400;
  line-height: 16px;
  color: ${({ $positive }) => ($positive ? '#ff2e4e' : '#2B5276')};
`

const HeartButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`

const HeartIcon = styled.img`
  width: 22px;
  height: 22px;
`

const EmptyState = styled.div`
  padding: 40px 0 24px;
  text-align: center;
  color: #c4c4c4;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
`

const EmptyText = styled.div`
  color: var(--Neutral-300, #b0b0b0);
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

const HeartEmpty = styled.img`
  width: 24px;
  height: 24px;
`

const InvestButton = styled.button`
  display: flex;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: none;
  color: #ffffff;
  border-radius: var(--Radius-S, 8px);
  background: var(--Primary-500, #4880af);
`