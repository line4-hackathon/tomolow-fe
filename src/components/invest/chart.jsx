import styled from "styled-components";
import useSelect from "@/hooks/select";
import { DateTypes } from "@/pages/invest/selectType";
import CandleChart from "./CandleCharts";


export default function Chart({selectedMenu, handleSelect,symbol,chartData}) {
  return (
    <ChartBox>
      <CandleChart chartData={chartData}/>
      <DateBar>
        {Object.keys(DateTypes).map((key) => (
          <Term
            key={key}
            onClick={() => handleSelect(key)}
            // 3. 현재 선택된 메뉴 감지 및 스타일 적용
            $isSelected={selectedMenu === key ? true : false}
          >
            {DateTypes[key]} {/* 사용자에게 보이는 메뉴 이름 */}
          </Term>
        ))}
      </DateBar>
    </ChartBox>
  );
}
const ChartBox = styled.div`
  width: 100%;
`;
const ChartImg = styled.div`
    height: 300px;
`;
const DateBar = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  padding-left: 20px;
  margin-bottom: 15px;
`;
const Term = styled.div`
  display: flex;
  padding: var(--Spacing-XS, 4px) var(--Spacing-L, 16px);
  justify-content: center;
  align-items: center;
  border-radius: var(--Radius-L, 16px);
  background-color: ${({ $isSelected }) => ($isSelected ? "#e7e7e7" : "white")};

  color: ${({ $isSelected }) => ($isSelected ? "#333333" : "#B0B0B0")};
  text-align: center;

  /* Body-Regular */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  &:hover {
    cursor: pointer;
  }
`;
