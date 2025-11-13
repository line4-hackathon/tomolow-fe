import styled from 'styled-components'

export default function NavyButton({ name, width, height,onClick }) {
  return (
    <Box $width={width} $height={height} onClick={onClick}>
      {name}
    </Box>
  )
}
const Box = styled.button`
  display: flex;
  padding: 12px;
  justify-content: center;
  align-items: center;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};

  border-radius: var(--Radius-S, 8px);
  border: none;
  background: var(--Primary-500, #4880af);

  color: var(--Neutral-0, #fff);
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 133.333% */

  &:hover {
    cursor: pointer;
  }

  //클릭 모션
  /* 변화를 부드럽게 만들기 위한 transition */
  transition: 
    background-color 0.1s ease, 
    transform 0.1s ease,
    font-size 0.1s ease;
  
  /* --- 오버레이 정의 --- */
  &::before {
    content: ''; /* 가상 요소 필수 */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.0); /* 기본 상태: 투명 */
    pointer-events: none; /* 클릭을 방해하지 않도록 설정 */
    border-radius: 12px;
    
    /* 오버레이의 색상 변화만 부드럽게 */
    transition: background-color 0.1s ease; 
  }
  /* 2. 클릭 시 (:active) 스타일 변화 정의 */
  &:active {
    /* 글씨 크기 0.95배로 작게 */
    font-size: 0.95em; 
    
    /* 누르는 느낌을 주기 위해 살짝 축소 */
    transform: scale(0.98); 

    /* 가상 요소의 배경색을 반투명 검은색으로 변경하여 어둡게 함 */
    &::before {
      background-color: rgba(0, 0, 0, 0.20); 
    }
  }
`
