import styled from 'styled-components'

import RedHeart from '@/assets/icons/icon-heart-red.svg?react'
import GrayHeart from '@/assets/icons/icon-heart-gray.svg?react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APIService } from '@/pages/invest/api'
import useStockStore from '@/stores/stockStores'

export default function StockCard({ data }) {
  const [isInterest, setIsInterest] = useState(data.interested == '' ? data.interseted : true)
  const { stockData, setStockData } = useStockStore()
  let textColor = ''
  if (data.changeRate > 0) {
    textColor = '#0084FE'
  } else if (data.changeRate == 0) {
    textColor = '#11111'
  } else {
    textColor = '#ff2e4e'
  }

  const interest = async () => {
    try {
      const res = await APIService.private.post(`/api/interests/markets/${data.marketId}/toggle`)
      setIsInterest(!isInterest)
    } catch (error) {
      console.log('관심 등록/취소 실패')
    }
  }

  const navigate = useNavigate()
  const toTrading = () => {
    setStockData(data)
    navigate('/invest/trading')
  }

  return (
    <Card>
      {data.imgUrl ? <img src={data.imgUrl} /> : <Logo onClick={() => toTrading()} />}
      <TextBox onClick={() => toTrading()}>
        <Name>{data.name}</Name>
        <Detail>
          <Number>{data.symbol}</Number>
          {data.price ? (
            <Price $color={textColor}>
              {data.price.toLocaleString()}원({(data.changeRate * 100).toFixed(2)}%)
            </Price>
          ) : (
            ''
          )}
        </Detail>
      </TextBox>
      <Interest onClick={() => interest()}>{isInterest ? <RedHeart /> : <GrayHeart />}</Interest>
    </Card>
  )
}
const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--Spacing-XL, 24px);
  align-self: stretch;
  width: 320px;
  &:hover {
    cursor: pointer;
  }
`
const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 33px;
  background: var(--Primary-900, #263c54);
`
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`
const Detail = styled.div`
  display: flex;
  gap: 12px;
`
const Name = styled.div`
  color: var(--Neutral-900, #333);

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  align-self: stretch;
  margin-bottom: 8px;
`
const Number = styled.div`
  color: var(--Neutral-300, #b0b0b0);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
const Price = styled.div`
  color: ${({ $color }) => $color};

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
const Interest = styled.div`
  display: flex;
  margin-left: auto;
`
