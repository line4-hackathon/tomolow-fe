import styled from 'styled-components'
import Icon from '@/assets/icons/icon-search.svg?react';

export default function SearchBar({explain,searchName,setSearchName}) {
  return (
    <Bar>
      <Icon />
      <Input
        type='text'
        placeholder={explain}
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
    </Bar>
  )
}
const Bar = styled.div`
  display: flex;
  height: var(--Button-height-M, 48px);
  width: 343px;
  align-items: center;
  justify-content: center;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-100, #e8eef6);
  gap: 5px;
`
const Input = styled.input`
  width: 280px;
  height: 24px;
  background: var(--Primary-100, #e8eef6);
  border: none;

  ::placeholder {
    color: var(--Neutral-300, #b0b0b0);

    /* Body-Regular */
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
  &:focus {
    outline: none;
  }
`
