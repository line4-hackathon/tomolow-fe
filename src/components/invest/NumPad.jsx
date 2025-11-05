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

export default function Numpad({ isFocus, currentValue, price,count,setPrice, setCount }) {
  const keyboardRef = useRef()

  const onChange = (newInput) => {
    // 🚫 첫 글자가 0이고, 길이가 1보다 크면 (즉 01, 05 등)
    if (newInput.length >= 1 && newInput.startsWith('0')) {
      // 잘못된 입력이면 현재 키보드 상태를 되돌림
      if (keyboardRef.current) {
        keyboardRef.current.setInput('')
      }
      return
    }
    if (newInput.length > 1 && /^0\d+/.test(newInput)) {
      keyboardRef.current.setInput('')
      return
    }

    // ✅ 정상 입력만 반영
    if (isFocus) {
      setPrice(newInput)
    } else {
      setCount(newInput)
    }
  }
  const onKeyPress=(button)=>{
    if (button === '{bksp}') {
      if (isFocus) {
       onChange(price)
    } else {
      onChange(count)
    }
      return
    }
  }

  // 2. currentValue가 바뀔 때마다 키보드 인스턴스를 명시적으로 초기화 (핵심)
  useEffect(() => {
    if (keyboardRef.current) {
      keyboardRef.current.setInput(currentValue || '')
    }
  }, [currentValue, isFocus])

  return (
    <StyledKeyboardWrapper>
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        // 키보드 레이아웃 지정
        layout={NUMPAD_LAYOUT}
        // 버튼 클릭 시 호출되는 함수
        onChange={onChange}
        onKeyPress={onKeyPress}
        // 키보드의 너비를 좁게 설정
        keyboardClass={'simple-keyboard'}
        // 특수 키에 표시되는 텍스트를 변경할 수 있습니다.
        display={{
          '{bksp}': '←', // 백스페이스를 화살표로 표시
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
