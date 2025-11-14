import styled from 'styled-components'
import useSelect from '@/hooks/select'
import { DateTypes, LineDateTypes } from '@/pages/invest/selectType'
import CandleChart from './CandleCharts'
import { useEffect, useState } from 'react'
import StockLineChart from './LineChart'
import LineChartIcon from "@/assets/icons/icon-lineChart.svg?react"
import CandleChartIcon from "@/assets/icons/icon-candleChart.svg?react"

export default function Chart({
  selectedDate,
  setSelectedDate,
  symbol,
  chartData,
  setStartDate = '',
  setEndDate = '',
  isCandle,
  setIsCandle,
}) {
  const [dateData,setDateData]=useState(DateTypes)
  useEffect(()=>{
    if(isCandle){
      if(selectedDate=='SIXMONTH') setSelectedDate('THREEMONTH')
      setDateData(DateTypes)
    } else{
      if(selectedDate=='DAY') setSelectedDate('WEEK')
      setDateData(LineDateTypes)
    }
  },[isCandle])

    
  return (
    <ChartBox>
      {isCandle ? (
        <CandleChart chartData={chartData} setStartDate={setStartDate} setEndDate={setEndDate} />
      ) : (
        <StockLineChart chartData={chartData}/>
      )}
      <DateBar>
        {Object.keys(dateData).map((key) => (
        <Term
          key={key}
          onClick={() => setSelectedDate(key)}
          // 3. 현재 선택된 메뉴 감지 및 스타일 적용
          $isSelected={selectedDate === key ? true : false}
        >
          {dateData[key]} {/* 사용자에게 보이는 메뉴 이름 */}
        </Term>
      ))}
        {isCandle ? <LineChartIcon onClick={()=>setIsCandle(!isCandle)}/>:<CandleChartIcon onClick={()=>setIsCandle(!isCandle)}/>}
      </DateBar>
    </ChartBox>
  )
}
const ChartBox = styled.div`
  width: 100%;
`
const ChartImg = styled.div`
  height: 300px;
`
const DateBar = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  padding-left: 20px;
  margin-bottom: 15px;
`
const Term = styled.div`
  display: flex;
  padding: var(--Spacing-XS, 4px) var(--Spacing-L, 16px);
  justify-content: center;
  align-items: center;
  border-radius: var(--Radius-L, 16px);
  background-color: ${({ $isSelected }) => ($isSelected ? '#e7e7e7' : 'white')};

  color: ${({ $isSelected }) => ($isSelected ? '#333333' : '#B0B0B0')};
  text-align: center;

  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  &:hover {
    cursor: pointer;
  }
`
const ChartChangeButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--Radius-L, 16px);
  background-color: ${({ $isSelected }) => ($isSelected ? '#e7e7e7' : 'white')};

  color: ${({ $isSelected }) => ($isSelected ? '#333333' : '#B0B0B0')};
  text-align: center;
  width: 50px;
  height: 35px;

  /* Body-Regular */
  font-family: Inter;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  &:hover {
    cursor: pointer;
  }
`
