import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const ChartContainer = styled.div`
  width: 375px;
  height: 400px;
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
`

// ⭐️ 최고/최저가 점 표시용 커스텀 Dot
const CustomDot = ({ cx, cy, payload, maxClose, minClose }) => {
  if (payload.close === maxClose) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#ff3b30" // 🔴 최고가 - 빨간 점
        stroke="#fff"
        strokeWidth={1.5}
      />
    )
  }
  if (payload.close === minClose) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill="#007aff" //007aff 🔵 최저가 - 파란 점
        stroke="#fff"
        strokeWidth={1.5}
      />
    )
  }
  return null
}
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null
  const d = payload[0].payload

  const isUp = d.close > d.open
  const color = isUp ? '#2f6ef8' : '#e74c3c'
  const date = new Date(d.startTime)

  // 'ko-KR' 포맷을 사용하여 배열로 각 구성 요소를 추출
  const parts = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Seoul',
  }).formatToParts(date)

  // 추출된 구성 요소 배열을 원하는 형식으로 조합
  let year = ''
  let month = ''
  let day = ''

  parts.forEach((part) => {
    if (part.type === 'year') year = part.value
    if (part.type === 'month') month = part.value
    if (part.type === 'day') day = part.value
  })

  const finalDate = `${year}년 ${month}월 ${day}일`

  return (
    <ToolTip>
      <a>{finalDate}</a>
      <a>
        종가 <span style={{ color }}> {d.close.toLocaleString()}</span>
      </a>
      <a>
        시가: <span style={{ color }}>{d.open.toLocaleString()}</span>
      </a>
      <a>
        고가: <span style={{ color }}>{d.high.toLocaleString()}</span>
      </a>
      <a>
        저가: <span style={{ color }}>{d.low.toLocaleString()}</span>
      </a>
    </ToolTip>
  )
}

const StockLineChart = ({ chartData }) => {
      // ✅ 데이터 포맷 변환
  const formattedData = useMemo(() => {
    return chartData.map((item) => ({
      ...item,
      date: new Date(item.startTime).toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
      }),
      close: Number(item.close),
    }))
  }, [chartData])
      // ✅ 최고가 / 최저가 계산
  const maxClose = useMemo(
    () => Math.max(...formattedData.map((d) => d.close)),
    [formattedData]
  )
  const minClose = useMemo(
    () => Math.min(...formattedData.map((d) => d.close)),
    [formattedData]
  )
  const formatYAxis = (tickValue) => {
    return `${tickValue.toLocaleString()}원`
  }
  // 1. 폰트 사이즈를 결정하는 함수
  const getFontSize = (maxPrice) => {
    // 가격(숫자)을 문자열로 변환하여 길이를 측정
    const priceStringLength = String(Math.round(maxPrice)).length

    if (priceStringLength > 6) {
      // 7자리 이상 (e.g., 1,000,000)
      return 7
    } else if (priceStringLength > 4) {
      // 5~6자리 (e.g., 10,000 ~ 99,999)
      return 10
    } else {
      // 4자리 이하
      return 12
    }
  }
  // 2. 컴포넌트 내에서 사용
  const fontSize = getFontSize(maxClose)
  return (
    <ChartContainer>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: 15, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false}/>
          <YAxis domain={['auto', maxClose*1.01 ]} orientation="right" tick={{ fontSize: fontSize }} tickFormatter={formatYAxis} />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type='monotone'
            dataKey='close'
            stroke='#007aff'
            strokeWidth={3}
            dot={<CustomDot maxClose={maxClose} minClose={minClose} />}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default StockLineChart

const ToolTip = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  height: 128px;

  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  color: var(--Neutral-900, #333);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`