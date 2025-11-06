import React from 'react'
import styled from 'styled-components'
import ImgAd from '@/assets/images/img-ad-list.svg?react'
import RightArrow from '@/assets/icons/icon-right-arrow.svg?react'

const AdList = ({ onClick }) => {
  return (
    <List onClick={onClick}>
      <Left>
        <ImgAd />
        <Column>
          <Title>광고 시청하기</Title>
          <Subtitle>회당 {(500000).toLocaleString()}원</Subtitle>
        </Column>
      </Left>
      <RightArrow />
    </List>
  )
}

export default AdList

const List = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

const Left = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const Title = styled.p`
  color: var(--Neutral-900, #333);
  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
`

const Subtitle = styled.p`
  color: var(--Neutral-900, #333);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`
