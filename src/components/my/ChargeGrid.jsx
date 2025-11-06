import React from 'react'
import styled from 'styled-components'

const ChargeGrid = ({ ads, onClick }) => {
  return (
    <Grid>
      {ads.map((ad) => (
        <Card key={ad.id} onClick={() => onClick(ad)}>
          <Img src={ad.src} />
          <TextContainer>
            <Benefit>{ad.benefit}</Benefit>
            <PriceContainer>
              <Price>{ad.price}</Price>
            </PriceContainer>
          </TextContainer>
        </Card>
      ))}
    </Grid>
  )
}

export default ChargeGrid

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 52px;
  padding: 0 30.5px;

  @media (max-width: 350px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0 30.5px;
  }
`
const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  gap: 16px;
  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

const Img = styled.img``

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
`

const Benefit = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`
const PriceContainer = styled.div`
  padding: 4px;
  border-radius: var(--Radius-S, 8px);
  background: var(--Primary-100, #e8eef6);
`
const Price = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`
