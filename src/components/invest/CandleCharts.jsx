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

// ✅ styled-components
const ChartContainer = styled.div`
  width: 375px;
  height: 400px;
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
`

// ✅ 예시 데이터
const data = [
  { time: '09:00', open: 100, high: 104, low: 98, close: 102, volume: 300 },
  { time: '09:30', open: 102, high: 106, low: 101, close: 104, volume: 450 },
  { time: '10:00', open: 104, high: 108, low: 103, close: 106, volume: 500 },
  { time: '10:30', open: 106, high: 109, low: 104, close: 105, volume: 600 },
  { time: '11:00', open: 105, high: 106, low: 102, close: 103, volume: 700 },
  { time: '11:30', open: 103, high: 107, low: 101, close: 106, volume: 550 },
  { time: '12:00', open: 106, high: 111, low: 103, close: 108, volume: 620 },
  { time: '12:30', open: 108, high: 109, low: 103, close: 105, volume: 580 },
  { time: '13:00', open: 103, high: 107, low: 101, close: 106, volume: 500 },
  { time: '13:30', open: 103, high: 107, low: 101, close: 106, volume: 480 },
  { time: '14:00', open: 103, high: 107, low: 101, close: 106, volume: 520 },
  { time: '14:30', open: 103, high: 107, low: 101, close: 106, volume: 600 },
  { time: '15:00', open: 103, high: 107, low: 101, close: 106, volume: 650 },
  { time: '15:30', open: 103, high: 107, low: 101, close: 106, volume: 620 },
  { time: '16:00', open: 103, high: 107, low: 101, close: 106, volume: 550 },
  { time: '16:30', open: 103, high: 107, low: 101, close: 106, volume: 500 },
  { time: '17:00', open: 103, high: 107, low: 101, close: 106, volume: 460 },
  { time: '17:30', open: 103, high: 107, low: 101, close: 106, volume: 400 },
]

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

  return (
    <ToolTip>
      <a>{d.time}</a>
      <a>
        종가 <span style={{ color }}> {d.close}</span>
      </a>
      <a>
        시가: <span style={{ color }}>{d.open}</span>
      </a>
      <a>
        고가: <span style={{ color }}>{d.high}</span>
      </a>
      <a>
        저가: <span style={{ color }}>{d.low}</span>
      </a>
    </ToolTip>
  )
}

export default function CandleChart({ chartData }) {
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
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  width: 166px;
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
