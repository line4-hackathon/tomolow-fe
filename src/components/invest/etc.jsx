import styled from "styled-components";
import { EtcTypes } from "@/pages/invest/selectType";
import useSelect from "@/hooks/select";

export default function Etc() {
  const { selectedMenu, handleSelect } = useSelect("ORDER");
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
    </Box>
  );
}
const Box = styled.div`
  display: flex;
  flex-direction: column;
  background: var(--Neutral-50, #f6f6f6);
  display: flex;
  height: 308px;
  width: 100%;
  padding-top: var(--Spacing-L, 16px);
  align-items: flex-start;
  gap: var(--Spacing-2XL, 32px);
  flex-shrink: 0;
  align-self: stretch;
`;
const MenuBox = styled.div`
  display: flex;
  gap: 10px;
`;
const Menu = styled.div`
  display: flex;
  padding-bottom: var(--Spacing-S, 8px);
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--Clicked-P_600, #2b5276);

  color: var(--Clicked-P_600, #2b5276);
  text-align: center;

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
`;
const MenuInfo = styled.div``;
