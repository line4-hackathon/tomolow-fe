import styled from 'styled-components'

import StockInfo from '@/components/invest/stockInfo'
import Chart from '@/components/invest/chart'
import Etc from '@/components/invest/etc'
import InvestHeader from '@/components/invest/InvestHeader'
import RedButton from '@/components/invest/RedButton'
import BlueButton from '@/components/invest/BlueButton'

export default function InvestTradingPage() {
  return (
    <Page>
      <InvestHeader />
      <Contents>
        <StockInfo />
        <Chart />
        <Etc />
      </Contents>
        <Bar>
            <RedButton width="343px" height="56px"/>
        </Bar>
    </Page>
  )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Contents = styled.div`
  width: 375px;
  height: 590px;
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
`
const Bar=styled.div`
    display: flex;
width: 375px;
flex-direction: column;
align-items: center;
justify-content: center;
height: 88px;
gap: 21px;
`
