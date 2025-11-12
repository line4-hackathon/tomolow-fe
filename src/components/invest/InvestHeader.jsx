import styled from 'styled-components'

import BackButton from '@/assets/icons/icon-back.svg?react'
import RedHeart from '@/assets/icons/icon-heart-red.svg?react'
import GrayHeart from '@/assets/icons/icon-heart-gray.svg?react'
import { useState } from 'react'
import useStockStore from '@/stores/stockStores'
import { useNavigate } from 'react-router-dom'
import { APIService } from '@/pages/invest/api'

export default function InvestHeader() {
  const { stockData, setStockData } = useStockStore()
  const [isInterest, setIsInterest] = useState(stockData.interested)
  const navigate=useNavigate();
  
  const interest = async () => {
    try {
      const res = await APIService.private.post(`/api/interests/markets/${stockData.marketId}/toggle`)
      setIsInterest(!isInterest)
    } catch (error) {
      console.log('관심 등록/취소 실패')
    }

  }
  return (
    <HeaderBar>
      <BackButton onClick={()=>navigate(-1)}/>
      <HeaderInfo>
        <HeadName>{stockData.name}</HeadName>
        <HeadPrice>
          {stockData.price ?  stockData.price.toLocaleString():"0"}원({(stockData.changeRate * 100).toFixed(2)}%)
        </HeadPrice>
      </HeaderInfo>
      {isInterest ? (
        <RedHeart onClick={() => interest()} />
      ) : (
        <GrayHeart onClick={() => interest()} />
      )}
    </HeaderBar>
  )
}
const HeaderBar = styled.header`
  display: flex;
  width: 343px;
  padding: 10px 16px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.5px solid var(--Neutral-100, #e7e7e7);
  background: var(--Neutral-0, #fff);
`
const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const HeadName = styled.div`
  color: var(--Neutral-900, #333);
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`
const HeadPrice = styled.div`
  color: var(--Alert-Red, #ff2e4e);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
