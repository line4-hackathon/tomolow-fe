import React from 'react'
import styled from 'styled-components'
import AssetDonut from '@/components/home/AssetDonut.jsx'

// 하드코딩 (나중에 백엔드 값으로 교체)
function MyAssets({ mode = 'personal', title = '내 자산 현황' }) {
  const investAmount = 2333354 // 투자
  const cashAmount = 4333354 // 현금
  const totalAmount = investAmount + cashAmount // 전체 자산
  const formatNumber = (num) => num.toLocaleString('ko-KR')

  return (
    <Container mode={mode}>
      <SectionTitle>{title}</SectionTitle>

      {/* 도넛 + 가운데 전체 자산 텍스트 */}
      <DonutBox>
        <AssetDonut investAmount={investAmount} cashAmount={cashAmount} />
        <CenterLabel>
          <CenterAsset>전체 자산</CenterAsset>
          <CenterValue>{formatNumber(totalAmount)}원</CenterValue>
        </CenterLabel>
      </DonutBox>

      {/* 투자 / 현금 금액 */}
      <LegendRow>
        <LegendTop>
          <LegendItem>
            <LegendDot $color='#4880AF' />
            <LegendText>투자</LegendText>
          </LegendItem>
          <LegendValue>{formatNumber(investAmount)}원</LegendValue>
        </LegendTop>

        <LegendBottom>
          <LegendItem>
            <LegendDot $color='#E8EEF6' />
            <LegendText>현금</LegendText>
          </LegendItem>
          <LegendValue>{formatNumber(cashAmount)}원</LegendValue>
        </LegendBottom>
      </LegendRow>

      <Divider></Divider>

      {/* 투자 손익 */}
      <ProfitRow>
        <ProfitLabel>투자 손익</ProfitLabel>
        <ProfitValue>+33,367원(+99.8%)</ProfitValue>
      </ProfitRow>
    </Container>
  )
}

export default MyAssets

const Container = styled.section`
  display: flex;
  flex-direction: column;
  background: var(--Neutral-0, #fff);
  align-items: flex-start;
  padding: ${({ mode }) =>
    mode === 'group'
      ? '16px var(--Grid-Margin, 16px) var(--Spacing-L, 16px) var(--Grid-Margin, 16px)'
      : '32px var(--Grid-Margin, 16px) var(--Spacing-L, 16px) var(--Grid-Margin, 16px)'};
  gap: var(--Spacing-L, 16px);
  align-self: stretch;
`

const SectionTitle = styled.h3`
  color: var(--Neutral-900, #2b5276);
  font-size: 20px;
  line-height: 28px;
  font-weight: 400;
  align-self: stretch;
`

// 반원 도넛 영역
const DonutBox = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin: 8px 0 16px;
  width: 343px;
  height: 172px;
`

const CenterLabel = styled.div`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`

const CenterAsset = styled.div`
  color: var(--Neutral-900, #333);
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 140% */
`

const CenterValue = styled.div`
  color: var(--Neutral-900, #333);
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
`

// 투자 / 현금 라벨 + 금액
const LegendRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Spacing-S, 8px);
  align-self: stretch;
`

const LegendTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--Spacing-S, 8px);
`

const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${({ $color }) => $color};
`

const LegendText = styled.span`
  font-size: 14px;
  color: #555555;
`

const LegendBottom = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`

const LegendValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
`

const Divider = styled.div`
  display: flex;
  width: 343px;
  height: 1px;
  padding: 0 0.4px;
  justify-content: center;
  align-items: center;
  background-color: var(--Neutral-200, #d1d1d1);
`

const ProfitRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`

const ProfitLabel = styled.span`
  color: var(--Neutral-600, #5d5d5d);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`

const ProfitValue = styled.span`
  color: var(--Alert-Red, #ff2e4e);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`
