import styled from 'styled-components'

import BackButton from '@/assets/icons/icon-back.svg?react'
import RedHeart from '@/assets/icons/icon-heart-red.svg?react'
import GrayHeart from '@/assets/icons/icon-heart-gray.svg?react'
import { useState } from 'react'

export default function InvestHeader({data}) {
  const [isInterest, setIsInterest] = useState(false)
  return (
    <HeaderBar>
      <BackButton />
      <HeaderInfo>
        <HeadName>{data.marketName}</HeadName>
        <HeadPrice>{data.tradePrice}원({data.changeRate}%)</HeadPrice>
      </HeaderInfo>
      {isInterest ? (
        <RedHeart onClick={() => setIsInterest(false)} />
      ) : (
        <GrayHeart onClick={() => setIsInterest(true)} />
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
