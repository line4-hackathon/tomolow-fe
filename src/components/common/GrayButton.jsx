import styled from 'styled-components'

export default function GrayButton({ name, width, height, onClick}) {
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
  background: var(--Neutral-100, #e7e7e7);

  color: var(--Neutral-500, #6d6d6d);
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;

  position: relative; /* ::before 오버레이 필요 */

  &:hover {
    cursor: pointer;
  }

  /* --- 오버레이 정의 --- */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: rgba(0, 0, 0, 0); /* 기본 투명 */
    pointer-events: none;
  }

  /* 클릭 시 오버레이만 진해짐 */
  &:active::before {
    background-color: rgba(0, 0, 0, 0.2);
  }
`