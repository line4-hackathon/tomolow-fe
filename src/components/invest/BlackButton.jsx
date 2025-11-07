import styled from "styled-components";

export default function BlackButton({name,width,height,onClick}){
    return(
        <Button  $width={width} $height={height} onClick={onClick}>{name}</Button>
    )
}
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: var(--Alert-Blue, #333333);
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