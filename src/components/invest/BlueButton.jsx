import styled from 'styled-components'

export default function BlueButton({ width, height }) {
  return (
    <Button $width={width} $height={height}>
      매도
    </Button>
  )
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  border: none;
  background: var(--Alert-Blue, #0084fe);
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};

  color: var(--Neutral-0, #fff);
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`
