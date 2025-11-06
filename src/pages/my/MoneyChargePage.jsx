import React from 'react'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import ChargeGuide from '@/components/my/ChargeGuide'
import AdList from '@/components/my/AdList'
import ChargeGrid from '@/components/my/ChargeGrid'
import adGrid from '@/assets/images/img-ad-grid.svg'

// 임시 광고 데이터
const ads = [
  {
    id: 1,
    benefit: '+1,000만원',
    price: '1200원',
    src: adGrid,
  },
  {
    id: 2,
    benefit: '+500만원',
    price: '800원',
    src: adGrid,
  },
  {
    id: 3,
    benefit: '+700만원',
    price: '1000원',
    src: adGrid,
  },
  {
    id: 4,
    benefit: '+1,000만원',
    price: '1200원',
    src: adGrid,
  },
  {
    id: 5,
    benefit: '+1,000만원',
    price: '1200원',
    src: adGrid,
  },
]

const MoneyRechargePage = () => {
  const handleAdClick = () => {
    console.log('광고 클릭')
  }

  const handleAdGridClick = (ad) => {
    console.log(`${ad.benefit} 획득`)
  }
  return (
    <>
      <Header title='머니충전' showIcon={true} path='/mypage' />
      <Container>
        <ChargeGuide />
        <AdList onClick={handleAdClick} />
        <ChargeGrid ads={ads} onClick={handleAdGridClick} />
      </Container>
    </>
  )
}

export default MoneyRechargePage

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px 16px;
  background: var(--Neutral-50, #f6f6f6);
  gap: 16px;
`
