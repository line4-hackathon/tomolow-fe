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
`
