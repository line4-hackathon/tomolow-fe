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
  font-weight: 500;
  line-height: 16px;

  position: relative; /* ← ::before 오버레이 위해 필수 */

  &:hover {
    cursor: pointer;
  }

  /* --- 오버레이 요소 --- */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: rgba(0, 0, 0, 0); /* 기본 투명 */
    pointer-events: none;
  }

  /* 클릭 시 오버레이만 어둡게 */
  &:active::before {
    background-color: rgba(0, 0, 0, 0.2);
  }
`