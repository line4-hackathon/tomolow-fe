import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
  Rectangle,
} from 'recharts'
import { scaleLinear } from 'd3-scale' // ✅ y좌표 변환용
import { APIService } from '@/pages/invest/api'
import { useLocation } from 'react-router-dom'

// ✅ styled-components
const ChartContainer = styled.div`
  width: 375px;
  height: 400px;
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
`

// ✅ 커스텀 캔들 shape
const CandleShape = ({ x, width, yScale, payload }) => {
  const { open, close, high, low } = payload
  const isUp = close > open
  const color = isUp ? '#2f6ef8' : '#e74c3c'

  const highY = yScale(high)
  const lowY = yScale(low)
  const openY = yScale(open)
  const closeY = yScale(close)

  const centerX = x + width / 2
  const bodyTop = isUp ? closeY : openY
  const bodyBottom = isUp ? openY : closeY
  const bodyHeight = Math.max(1, bodyBottom - bodyTop)

  return (
    <g>
      <line x1={centerX} x2={centerX} y1={highY} y2={lowY} stroke={color} strokeWidth={1.5} />
      <Rectangle x={x} y={bodyTop} width={width} height={bodyHeight} fill={color} stroke={color} />
    </g>
  )
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

export default function CandleChart({ chartData, setStartDate = '', setEndDate = '' }) {
  const location = useLocation()
  const isLearning = location.pathname.startsWith('/learning')

  // ✅ y축 도메인 계산
  const allPrices = chartData.flatMap((d) => [d.high, d.low])
  const minY = Math.min(...allPrices)
  const maxY = Math.max(...allPrices)

  // 거래량 최대값 계산 (거래량 축 도메인 설정용)
  const maxVolume = Math.max(...chartData.map((d) => d.volume))

  // ✅ y좌표 변환 함수 (d3-scale 사용)
  const yScale = useMemo(() => {
    return scaleLinear().domain([minY, maxY]).range([300, 50])
  }, [minY, maxY])
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
  const fontSize = getFontSize(maxY)

  const candleClick = (data) => {
    if (isLearning) {
      setStartDate(data.startTime)
      setEndDate(data.endTime)
    }
  }

  return (
    <ChartContainer>
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, bottom: 20, left: 20 }}
          barCategoryGap='0%'
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />

          <YAxis
            orientation='right'
            domain={[minY - 1, maxY + 1]}
            tick={{ fontSize: fontSize }}
            tickFormatter={formatYAxis}
            yAxisId={0} // 명시적으로 ID 0 지정
          />
          <YAxis
            yAxisId={1}
            orientation='left' // 왼쪽에 숨김
            domain={[0, maxVolume * 3]} // 거래량의 최대치보다 훨씬 크게 잡아 차트 상단에 영향 X
            range={[380, 320]}
            hide={true} // 축 자체를 숨김
          />

          <Tooltip content={<CustomTooltip />} />

          {/* ✅ 캔들 */}
          <Bar
            dataKey='close'
            barSize={20}
            shape={(props) => <CandleShape {...props} yScale={yScale} />}
            isAnimationActive={false}
            yAxisId={0} // 가격 축 사용
            onClick={(data) => candleClick(data.payload)}
          />

          {/* ✅ 거래량 바 (하단) */}
          <Bar
            dataKey='volume'
            barSize={20}
            fill='#d0d0d0'
            opacity={0.5}
            shape={(props) => {
              const { x, width, payload } = props
              const color = payload.close > payload.open ? '#2f6ef8' : '#e74c3c'

              const baseY = 380 // 거래량 바의 기준선 (아래쪽)
              const maxBarHeight = 60 // 거래량 막대 최대 높이
              const barHeight = (payload.volume / maxVolume) * maxBarHeight // 비율 계산

              // ✅ 아래에서 위로 자라도록
              const y = baseY - barHeight

              return <rect x={x} y={y} width={width} height={barHeight} fill={color} />
            }}
            yAxisId={1}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

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
