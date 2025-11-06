import React, { useState } from 'react'
import styled from 'styled-components'
import useSelect from '@/hooks/select'
import { useNavigate } from 'react-router-dom'
import rightArrow from '@/assets/icons/icon-right-arrow.svg'
import heartOn from '@/assets/icons/icon-heart-red.svg'
import heartOff from '@/assets/icons/icon-heart-gray.svg'
import heartBlue from '@/assets/icons/icon-heart-navy.svg'

const TABS = [
  { key: 'hold', label: '보유' },
  { key: 'interest', label: '관심' },
]


function HoldInterest() {
  const { selectedMenu, handleSelect } = useSelect('hold') // 기본 탭: 보유
  const navigate = useNavigate()

  // --- dummy data ---
  const holdingStocks = [
    {
      id: 1,
      name: '삼성전자',
      quantity: 3,
      price: 87000,
      diffText: '+10.5%',
    },
    {
      id: 2,
      name: '카카오',
      quantity: 2,
      price: 60000,
      diffText: '-1.2%',
    },
  ]

  const interestStocks = [
    {
      id: 1,
      name: '삼성전자',
      code: '005930',
      price: 87000,
      diffText: '+10.5%',
      isLiked: true,
    },
    {
      id: 2,
      name: '현대차',
      code: '005380',
      price: 198000,
      diffText: '+3.2%',
      isLiked: true,
    },
  ]

  const [interestList, setInterestList] = useState(interestStocks)

  const isHoldTab = selectedMenu === 'hold'
  const rawList = isHoldTab ? holdingStocks : interestList
  const list = rawList || [] // undefined/null 방어
  const hasItems = Array.isArray(list) && list.length > 0


  const handleTabClick = (key) => {
    handleSelect(key)
  }

  const handleInvestClick = () => {
    navigate('/invest')
  }

  const toggleLike = (id) => {
    setInterestList((prev) =>
      prev.map((stock) =>
        stock.id === id ? { ...stock, isLiked: !stock.isLiked } : stock
      )
    )
  }

  return (
    <Container>
      {/* 머니 충전 영역 */}
      <MoneyCharge>
        <LeftBox>
          <IconBox />
          <Label>머니 충전</Label>
        </LeftBox>
        <RightBox>
          <Arrow src={rightArrow} alt="이동 아이콘" />
        </RightBox>
      </MoneyCharge>

      {/* 탭 영역 */}
      <TabRow>
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            $active={selectedMenu === tab.key}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabRow>

      {/* 내용 영역 */}
      {hasItems ? (
        <CardList>
          {list.map((stock) => (
            <Card key={stock.id}>
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
                  {stock.price.toLocaleString('ko-KR')}원
                  <Diff $positive={stock.diffText.startsWith('+')}>
                    {stock.diffText}
                  </Diff>
                </Price>

                {!isHoldTab && (
                  <HeartButton onClick={() => toggleLike(stock.id)}>
                    <HeartIcon
                      src={stock.isLiked ? heartOn : heartOff}
                      alt="좋아요 아이콘"
                    />
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
`

const LeftBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconBox = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: #263c54;
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
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
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
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  gap: 8px;
  display: flex;
  flex-direction: column;
`

const Diff = styled.div`
  font-size: 12px;
  text-align: right;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
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
  color: var(--Neutral-300, #B0B0B0);
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
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
  background: var(--Primary-500, #4880AF);
`




