import styled from 'styled-components'

import RedHeart from '@/assets/icons/icon-heart-red.svg?react'
import GrayHeart from '@/assets/icons/icon-heart-gray.svg?react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APIService } from '@/pages/invest/api'

export default function StockCard({ data }) {
  const [isInterest, setIsInterest] = useState(data.interest)

  const interest = async () => {
    if (isInterest) {
      try {
        const res = await APIService.private.delete(`/api/stock/${data.marketId}/interest`)
      } catch (error) {
        console.log('관심 취소 실패')
      }
    } else {
      try {
        const res = await APIService.private.post(`/api/stock/${data.marketId}/interest`)
      } catch (error) {
        console.log('관심 등록 실패')
      }
    }
  }
  const navigate = useNavigate()
  const toTrading=()=>{
    navigate('/invest/trading', {
        state: {
          symbol: data.symbol,
        },
      })
  }

  return (
    <Card>
      <Logo onClick={()=>toTrading()} />
      <TextBox onClick={()=>toTrading()}>
        <Name>{data.name}</Name>
        <Detail>
          <Number>{data.symbol}</Number>
          <Price $color={data.changeRate>0? true:false}>{data.price}({(data.changeRate*100).toFixed(2)}%)</Price>
        </Detail>
      </TextBox>
      <Interest onClick={() => setIsInterest(!isInterest)}>
        {isInterest ? <RedHeart /> : <GrayHeart />}
      </Interest>
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
  color: ${({$color})=> $color ? "#ff2e4e":"#0084FE"};

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
