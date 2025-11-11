import React from 'react'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import ChargeGuide from '@/components/my/ChargeGuide'
import AdList from '@/components/my/AdList'
import ChargeGrid from '@/components/my/ChargeGrid'
import adGrid1 from '@/assets/images/img-ad-grid1.svg'
import adGrid2 from '@/assets/images/img-ad-grid2.svg'
import adGrid3 from '@/assets/images/img-ad-grid3.svg'
import adGrid4 from '@/assets/images/img-ad-grid4.svg'
import MenuBar from '@/components/common/MenuBar'

// 임시 광고 데이터
const ads = [
  {
    id: 1,
    benefit: '+1,000만원',
    price: '1,200원',
    src: adGrid1,
  },
  {
    id: 2,
    benefit: '+3,000만원',
    price: '4,900원',
    src: adGrid2,
  },
  {
    id: 3,
    benefit: '+5,000만원',
    price: '7,500원',
    src: adGrid3,
  },
  {
    id: 4,
    benefit: '+1억원',
    price: '12,000원',
    src: adGrid4,
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
      <Scrollable>
        <Header title='머니충전' showIcon={true} path='/mypage' />
        <Container>
          <ChargeGuide />
          <AdList onClick={handleAdClick} />
          <ChargeGrid ads={ads} onClick={handleAdGridClick} />
        </Container>
      </Scrollable>
      <MenuBar />
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
