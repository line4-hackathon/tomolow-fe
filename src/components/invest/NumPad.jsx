import styled from 'styled-components'
import React, { useRef, useState, useEffect } from 'react'
// 1. React 래퍼 임포트
import Keyboard from 'react-simple-keyboard'
// 2. 기본 CSS 임포트
import 'react-simple-keyboard/build/css/index.css'

// 이미지와 유사한 숫자 키패드 레이아웃 정의
const NUMPAD_LAYOUT = {
  default: [
    '1 2 3',
    '4 5 6',
    '7 8 9',
    '00 0 {bksp}', // 00, 0, 백스페이스({bksp})
  ],
}

export default function Numpad({
  isFocus,
  currentValue = '',
  price,
  count,
  setPrice,
  setCount,
}) {
  const keyboardRef = useRef(null)
  const valueRef = useRef(currentValue)

  // 외부값(currentValue)이 바뀌면 키보드 UI 동기화 (초기 로드 / 포커스 전환)
  useEffect(() => {
    valueRef.current = currentValue
    keyboardRef.current?.setInput(currentValue || '')
  }, [currentValue, isFocus])

  // 외부 상태를 바꿔주는 헬퍼
  const applyValue = (val) => {
    if (isFocus) setPrice(val)
    else setCount(val)
  }

  // 버튼 눌림 처리: currentValue(외부)를 기준으로 nextValue 계산 -> 바로 상태 적용
  const onKeyPress = (button) => {
    const cur = String(valueRef.current || '')
    // 백스페이스 처리: 외부 상태에서 한 글자 삭제
    if (button === '{bksp}') {
      const next = cur.slice(0, -1)
      applyValue(next)
      // 화면 동기화
      keyboardRef.current?.setInput(next)
      return
    }

    // 숫자/00 입력 처리
    let toAppend = button
    // simple-keyboard는 버튼 문자열을 그대로 전달하므로 '00'도 그대로 처리
    if (!/^\d+$/.test(toAppend)) {
      // 숫자 또는 '00'이 아닌 버튼(예: 다른 커스텀키)은 무시
      return
    }

    const next = cur + toAppend

    // --- 검증 규칙 ---
    // 1) 처음 문자로 '0' 단독 허용 금지: currentValue가 빈 문자열일 때 버튼이 '0'이면 차단
    if (cur === '' && toAppend === '0') {
      // 차단: 아무 동작 안 함 (원한다면 피드백 UI 추가)
      // 화면에 잘못 보이는 걸 방지하려면 setInput(cur)로 동기화
      keyboardRef.current?.setInput(cur)
      return
    }

    // 2) 0으로 시작하는 다자리 숫자(예: 01, 005 등) 차단
    // next이 '0...' 형태이면 차단
    if (/^0\d+/.test(next)) {
      // 차단: 외부 상태 유지, 화면 동기화
      keyboardRef.current?.setInput(cur)
      return
    }

    // 통과하면 외부 상태에 바로 적용하고 화면 동기화
    applyValue(next)
    keyboardRef.current?.setInput(next)
  }

  return (
    <StyledKeyboardWrapper>
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layout={NUMPAD_LAYOUT}
        onKeyPress={onKeyPress}
        input={String(currentValue ?? '')}
        keyboardClass="simple-keyboard"
        display={{
          '{bksp}': '←',
        }}
      />
    </StyledKeyboardWrapper>
  )
}

// 1. 키보드를 감싸는 Styled Component 정의
const StyledKeyboardWrapper = styled.div`
  width: 375px;
  height: 272px;
  max-width: 320px; /* 키패드 전체 너비 제한 */
  margin: 0 auto;

  /* Simple-Keyboard의 기본 CSS 클래스를 오버라이드 */
  &.simple-keyboard {
    border-radius: 10px;
    padding: 10px;
    background-color: #fff; /* 배경색 조정 (이미지처럼 어둡게) */
  }
  .hg-theme-default {
    background-color: #fff;
    border: none;
  }

  /* 개별 키 버튼 스타일 */
  .hg-button {
    height: 60px;
    background: #fff;
    border-radius: 8px; /* 버튼 모서리 둥글게 */
    transition: all 0.1s ease;
    box-shadow: none;
    border: none;

    color: var(--Neutral-900, #333);
    text-align: center;
    font-family: Inter;
    font-size: 32px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  /* 눌렸을 때의 스타일 */
  .hg-button:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
    background: #ccc;
  }

  /* 백스페이스 키 스타일 */
  .hg-button.hg-button-bksp {
    width: 20px;
    background: #fff; /* 다른 키와 동일하게 설정 */
  }
`
