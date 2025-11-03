import styled from 'styled-components'

export default function GrayButton({ name, width, height }) {
  return (
    <Box $width={width} $height={height}>
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
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 133.333% */

  &:hover {
    cursor: pointer;
  }
`
