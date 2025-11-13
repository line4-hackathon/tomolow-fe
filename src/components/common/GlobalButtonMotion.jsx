import { createGlobalStyle } from 'styled-components';

export const GlobalButtonStyles = createGlobalStyle`
  /* ⭐️ 모든 <button> 태그에 스타일 적용 */
  button {
    /* 기존 Styled Component에서 가져온 필수 설정 */
    position: relative; 
    overflow: hidden; 
    border-radius: 12px; /* 버튼 모서리 둥글기 설정 (::before와 일치) */
    
    /* 버튼 자체의 transition (transform, font-size) */
    transition: 
        transform 0.1s ease, 
        font-size 0.1s ease;
    
    /* 1. 오버레이 가상 요소의 기본 상태 (::before) */
    &::before {
        content: ''; 
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        background-color: rgba(0, 0, 0, 0.0); 
        pointer-events: none; 
        transition: background-color 0.1s ease; 
    }

    /* 2. 버튼 클릭 시 (:active) 스타일 변화 */
    &:active {
        font-size: 0.95em; 
        transform: scale(0.98); 
    }

    /* 3. 클릭 시 (:active::before) 오버레이 색상 변화 */
    &:active::before {
        background-color: rgba(0, 0, 0, 0.20); 
    }

    /* ⚠️ 주의: 기존 버튼에 배경색이 없다면 추가해야 합니다.
       예: background-color: #FF2E4E;
    */
  }
`;