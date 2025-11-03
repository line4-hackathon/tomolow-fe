import styled from "styled-components";

export default function StockInfo() {
  return (
    <Box>
      <Stock $fontSize="20px">삼성전자</Stock>
      <Stock $fontSize="24px">117,000원</Stock>
      <Yesterday>
        어제보다 <a style={{ color: "#FF2E4E" }}>+8,7000원</a>
      </Yesterday>
      <MoveAverage>
        이동평균선 <a style={{ color: "#57B789" }}>5 </a>
        <a style={{ color: "#FF2E4E" }}>20 </a>
        <a style={{ color: "#FB9F4D" }}>60 </a>
        120
      </MoveAverage>
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 343px;
`;
const Stock = styled.div`
  color: var(--Neutral-900, #333);
  /* Head-Medium */
  font-family: Inter;
  font-size: ${({ $fontSize }) => $fontSize};
  font-style: normal;
  font-weight: 500;
  line-height: 28px; /* 140% */
`;
const Yesterday = styled.div`
  color: ${({ $fontColor }) => $fontColor};

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`;
const MoveAverage = styled.div`
  font-family: Inter;
  font-size: 8px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 200% */
`;
