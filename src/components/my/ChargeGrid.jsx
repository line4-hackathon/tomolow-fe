import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import adGrid1 from '@/assets/images/img-ad-grid1.svg'
import adGrid2 from '@/assets/images/img-ad-grid2.svg'
import adGrid3 from '@/assets/images/img-ad-grid3.svg'
import adGrid4 from '@/assets/images/img-ad-grid4.svg'
import Toast from '../common/Toast'
import Loading from '../common/Loading'

const ads = [
  {
    id: 1,
    benefit: '+1,000만원',
    price: '1,200원',
    src: adGrid1,
    endpoint: '/10m',
  },
  {
    id: 2,
    benefit: '+3,000만원',
    price: '4,900원',
    src: adGrid2,
    endpoint: '/30m',
  },
  {
    id: 3,
    benefit: '+5,000만원',
    price: '7,500원',
    src: adGrid3,
    endpoint: '/50m',
  },
  {
    id: 4,
    benefit: '+1억원',
    price: '12,000원',
    src: adGrid4,
    endpoint: '/100m',
  },
]

const ChargeGrid = () => {
  const [loading, setLoading] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const apiUrl = import.meta.env.VITE_API_BASE_URL

  const handleCharge = async (endpoint) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('accessToken')
      const res = await axios.post(
        `${apiUrl}/api/mypage/cash${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setToastMsg(`머니가 충전되었어요.`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  return (
    <>
      <Grid>
        {ads.map((ad) => (
          <Card key={ad.id} onClick={() => handleCharge(ad.endpoint)}>
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
      {toastMsg && <Toast msg={toastMsg} onClose={() => setToastMsg('')} />}
    </>
  )
}

export default ChargeGrid

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 52px;
  padding: 0 14.5px;

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
  cursor: pointer;
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
