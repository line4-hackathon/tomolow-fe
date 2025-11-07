import styled from 'styled-components'
import NavyButton from '../common/NavyButton'

export default function PurchasCount({ onClick, count, price,maxCount}) {
  return (
    <Box>
      <a>수량</a>
      <CountBox>
        <CountInput placeholder='숫자를 입력하세요' value={count} readOnly onClick={onClick} />주
        {price ? (
          <NavyButton name='최대' width='47px' height='32px' onClick={maxCount}/>
        ) : (
          <CountButton >최대</CountButton>
        )}
      </CountBox>
    </Box>
  )
}
const Box = styled.div`
  display: flex;
  width: 327px;
  height: 112px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 16px;
  margin-top: 19px;
  gap: 10px;
  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);
  /* Bottom */
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);

  color: var(--Neutral-900, #333);

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`
const CountBox = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--Neutral-900, #333);

  /* Title-Semi Bold */
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
`
const CountInput = styled.input`
  width: 225px;
  border: none;
  color: var(--Neutral-900, #333);

  /* Title-Semi Bold */
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 133.333% */
  &:placeholder-shown {
    color: var(--Neutral-300, #b0b0b0);

    /* Title-Semi Bold */
    font-family: Inter;
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: 32px; /* 133.333% */
  }
  &:focus {
    outline: none;
  }
`
const CountButton = styled.button`
  display: flex;
  width: 47px;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: var(--Radius-S, 8px);
  background: var(--Neutral-200, #d1d1d1);
  border: none;

  color: var(--Neutral-0, #fff);
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 133.333% */
`
