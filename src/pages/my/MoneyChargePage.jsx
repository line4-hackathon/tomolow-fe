import React from 'react'
import { Scrollable } from '@/styles/Scrollable.styled'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import ChargeGuide from '@/components/my/ChargeGuide'
import AdList from '@/components/my/AdList'
import ChargeGrid from '@/components/my/ChargeGrid'
import MenuBar from '@/components/common/MenuBar'

const MoneyRechargePage = () => {
  return (
    <>
      <Scrollable>
        <Header title='머니충전' showIcon={true} path='/mypage' />
        <Container>
          <ChargeGuide />
          <AdList />
          <ChargeGrid />
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
  padding: 32px 16px;
  background: var(--Neutral-50, #f6f6f6);
  gap: 16px;
`
