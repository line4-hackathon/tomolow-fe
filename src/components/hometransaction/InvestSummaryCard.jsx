import React from 'react'
import styled from 'styled-components'

const InvestSummaryCard = ({ summary }) => {
  const { profit, profitRate, totalBuy, totalSell } = summary || {}

  const rateColor = profit > 0 ? '#FF2E4E' : profit < 0 ? '#0084FE' : '#333'

  return (
    <Card>
      <SummaryText>
        <Title>기간 내 손익</Title>
        <BigText>{`${profit?.toLocaleString()}원`}</BigText>
        <Rate color={rateColor}>{`(${(profitRate * 100).toFixed(2)}%)`}</Rate>
      </SummaryText>
      <Detail>
        <Row>
          <Label>총 매수 금액</Label>

          <Money>{`${totalBuy?.toLocaleString()}원`}</Money>
        </Row>
        <Row>
          <Label>총 매도 금액</Label>
          <Money>{`${totalSell?.toLocaleString()}원`}</Money>
        </Row>
      </Detail>
    </Card>
  )
}

export default InvestSummaryCard

const Card = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  gap: 16px;
`

const SummaryText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 4px;
`

const Title = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`

const BigText = styled.p`
  color: var(--Neutral-900, #333);
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
`
const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const Rate = styled.p`
  color: ${(props) => props.color || '#333'};
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Label = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
const Money = styled.div`
  display: inline-flex;
`

const Number = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`
