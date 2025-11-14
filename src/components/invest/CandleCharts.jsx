import React, { useEffect, useMemo, useState, useRef } from 'react'
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
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none; /* Firefox */
`

// ✅ 커스텀 캔들 shape
const CandleShape = ({ x, width, yScale, payload }) => {
  const { open, close, high, low } = payload
  const isUp = close > open
  const color = isUp ? '#e74c3c' : '#2f6ef8'

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
  const color = isUp ? '#e74c3c' : '#2f6ef8'
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
  const chartRef = useRef(null);

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

    // ⭐️⭐️⭐️ 스크롤링 및 크기 유지 로직 ⭐️⭐️⭐️
  const MIN_BAR_WIDTH = 15 // 캔들당 최소 너비 (px)
  const VIEWPORT_WIDTH = 375 // ChartContainer의 고정된 너비
    // 데이터 길이에 따른 최소 요구 너비 계산
  const requiredWidth = chartData.length * MIN_BAR_WIDTH;
  // 실제 차트 너비: 뷰포트보다 크면 요구 너비 사용, 작으면 뷰포트 너비 사용
  const chartWidth = Math.max(VIEWPORT_WIDTH, requiredWidth);
  // ⭐️⭐️⭐️ ⭐️⭐️⭐️ ⭐️⭐️⭐️ ⭐️⭐️⭐️ ⭐️⭐️⭐️
    // ⭐️ 2. 렌더링 후 스크롤을 오른쪽 끝으로 이동 ⭐️
  useEffect(() => {
    if (chartRef.current) {
      // scrollWidth: 스크롤 가능한 전체 내용의 너비
      // scrollLeft를 최대값으로 설정하여 가장 오른쪽으로 스크롤합니다.
      chartRef.current.scrollLeft = chartRef.current.scrollWidth;
    }
  }, [chartData, chartWidth]); // 데이터가 변경되거나 차트 너비가 변경될 때마다 실행

  return (
    <ChartContainer ref={chartRef}>
      <div style={{ width: chartWidth, height: '100%', flexShrink: 0 }}>
        <ComposedChart
          width={chartWidth} // 동적으로 계산된 너비 적용
          height={400}     // ChartContainer와 동일한 높이 유지
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
            barSize={MIN_BAR_WIDTH * 0.8}
            shape={(props) => <CandleShape {...props} yScale={yScale} />}
            isAnimationActive={false}
            yAxisId={0} // 가격 축 사용
            onClick={(data) => candleClick(data.payload)}
          />

          {/* ✅ 거래량 바 (하단) */}
          <Bar
            dataKey='volume'
            barSize={MIN_BAR_WIDTH * 0.8}
            fill='#d0d0d0'
            opacity={0.5}
            shape={(props) => {
              const { x, width, payload } = props
              const color = payload.close > payload.open ? '#e74c3c' : '#2f6ef8'

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
      </div>
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
