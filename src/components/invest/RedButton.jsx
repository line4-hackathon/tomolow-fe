import styled from 'styled-components'

export default function RedButton({ width, height, onClick }) {
  return <Button $width={width} $height={height} onClick={onClick}>매수</Button>
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  background: var(--Alert-Blue, #FF2E4E);
  width: ${({$width})=>$width};
  height: ${({$height})=>$height};

  color: var(--Neutral-0, #fff);
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */

  border: none;
`
