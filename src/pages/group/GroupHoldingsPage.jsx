import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import MenuBar from '@/components/common/MenuBar'

// 더미 데이터
const dummyData = [
  {
    id: 1,
    src: '/src/assets/images/logo-company.svg',
    name: '삼성전자',
    quantity: 3,
    price: 87000,
    profit: 43000,
    rates: 10.5,
  },
  {
    id: 2,
    src: '/src/assets/images/logo-company.svg',
    name: '카카오',
    quantity: 2,
    price: 60000,
    profit: -20000,
    rates: -1.2,
  },
]

const GroupHoldingsPage = () => {
  const navigate = useNavigate()
  const getTextColor = (profit) => {
    if (profit > 0) return '#FF2E4E'
    if (profit < 0) return '#0084FE'
    return '#333'
  }
  return (
    <>
      <Scrollable>
        <Header title='보유종목' showIcon='true' path='/group/home' />
        <Container>
          <List>
            {dummyData.map((item) => (
              <Item key={item.id} onClick={() => navigate('/group/invest/trading')}>
                <Left>
                  <Img src={item.src} />
                  <LeftText>
                    <Name>{item.name}</Name>
                    <Quantity>{`${item.quantity.toLocaleString()}주`}</Quantity>
                  </LeftText>
                </Left>
                <Right>
                  <Price>{`${item.price.toLocaleString()}원`}</Price>
                  <ColoredText color={getTextColor(item.profit)}>
                    {`${item.profit.toLocaleString()}원`}
                    {`(${item.rates}%)`}
                  </ColoredText>
                </Right>
              </Item>
            ))}
          </List>
        </Container>
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default GroupHoldingsPage

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px 16px;
  background: var(--Neutral-50, #f6f6f6);
`
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Item = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
  border-radius: var(--Spacing-L, 16px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  cursor: pointer;
`

const Img = styled.img``
const Left = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

const LeftText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Name = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px; /* 150% */
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Quantity = styled.p`
  color: var(--Neutral-500, #6d6d6d);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Price = styled.p`
  color: var(--Neutral-900, #333);
  text-align: right;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px; /* 150% */
`

const ColoredText = styled.p`
  color: ${({ color }) => color};
  text-align: right;
  font-size: 12px;
  font-weight: 400;
`
