import styled from 'styled-components'
import { EtcTypes } from '@/pages/invest/selectType'
import useSelect from '@/hooks/select'
import EtcMyorder from './EtcMyorder'
import EtcNews from './EtcNews'
import EctAI from './EtcAI'

export default function Etc({selectedMenu, handleSelect,orderData,etcData}) {

  let contents
  switch (selectedMenu) {
    case 'ORDER':
      contents=<EtcMyorder data={orderData}/>
      break
    case 'NEWS':
      contents=<EtcNews data={etcData}/>
      break
    case 'AI':
      contents=<EctAI/>
      break
  }
  return (
    <Box>
      <MenuBox>
        {Object.keys(EtcTypes).map((key) => (
          <Menu
            key={key}
            onClick={() => handleSelect(key)}
            // 3. 현재 선택된 메뉴 감지 및 스타일 적용
            $isSelected={selectedMenu === key ? true : false}
          >
            {EtcTypes[key]} {/* 사용자에게 보이는 메뉴 이름 */}
          </Menu>
        ))}
      </MenuBox>
      {contents}
    </Box>
  )
}
const Box = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--Neutral-50, #f6f6f6);
  display: flex;
  width: 100%;
  padding: 16px 0px 22px 0px;
  gap: var(--Spacing-2XL, 32px);
  flex-shrink: 0;
  align-self: stretch;
  align-items: center;
`
const MenuBox = styled.div`
  display: flex;
  gap: 24px;
  padding-left: 16px;
  width: 343px;
`
const Menu = styled.div`
  display: flex;
  padding-bottom: var(--Spacing-S, 8px);
  justify-content: center;
  align-items: center;
  border-bottom: ${({ $isSelected }) =>
    $isSelected ? '1px solid var(--Clicked-P_600, #2b5276)' : ''};
  background: var(--Neutral-50, #f6f6f6);

  color: ${({ $isSelected }) => ($isSelected ? '#2b5276' : '#B0B0B0')};
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */

  &:hover {
    cursor: pointer;
  }
`
