import React from 'react'
import styled from 'styled-components'

function TransactionDateGroup({ date, list }) {
  return (
    <Container>
      <Date>{date.replace(/-/g, '.').slice(2)}</Date>
      <Line></Line>
      <ListContainer>
        {list.map((item, idx) => (
          <List key={idx}>
            <Left>
              <Time>{item.time}</Time>
              <Column>
                <BigText>{item.stock}</BigText>
                <SmallRow>
                  <SmallText>{item.price.toLocaleString()}원</SmallText>
                  <SmallText>{item.quantity}주</SmallText>
                </SmallRow>
              </Column>
            </Left>
            <Row>
              <BigText>{item.amount.toLocaleString()}원</BigText>
              <BigText color={item.type === '매수' ? '#FF2E4E' : '#0084FE'}>{item.type}</BigText>
            </Row>
          </List>
        ))}
      </ListContainer>
    </Container>
  )
}

export default TransactionDateGroup

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
`
const Date = styled.div`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
`

const Line = styled.div`
  height: 0.8px;
  background: var(--Neutral-200, #d1d1d1);
  margin: 8px 0 12px 0;
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
const List = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;

  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

const Left = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
`
const Time = styled.div`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const BigText = styled.p`
  color: ${(props) => props.color || 'var(--Neutral-900, #333)'};
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`

const SmallRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 8px;
  max-width: 100px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`

const SmallText = styled.p`
  color: var(--Neutral-500, #6d6d6d);
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`
