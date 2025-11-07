import React from 'react'
import styled from 'styled-components'

// 더미 랭킹 데이터
import { dummyRankingData } from '@/pages/group/dummyRankingData'

function GroupRankList(props) {
  return (
    <List>
      {
        /* 인원 수만큼 mapping */
        dummyRankingData.map((item) => (
          <Item key={item.rank}>
            <Left>
              <Rank>{item.rank}위</Rank>
              <Name>{item.name}</Name>
            </Left>
            <Profit $isPositive={item.profit > 0}>
              {item.profit > 0 ? '+' : ''}
              {item.profit.toLocaleString()}원
            </Profit>
          </Item>
        ))
      }
    </List>
  )
}

export default GroupRankList

const List = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--Neutral-0, #fff);
  padding: 0 16px;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  border-bottom: 0.8px solid #d1d1d1;

  &:last-child {
    border-bottom: none;
  }
`

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
`
const Rank = styled.p`
  color: var(--Neutral-600, #5d5d5d);
  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`

const Name = styled.p`
  color: var(--Neutral-900, #333);
  /* Head-Medium */
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
`

const Profit = styled.p`
  color: ${({ $isPositive }) => ($isPositive ? '#FF2E4E' : ' #0084FE')};
  font-weight: 600;
  text-align: right;
  min-width: 80px;
`
