import styled from "styled-components";

import RedHeart from "@/assets/images/isInterest.svg?react";
import GrayHeart from "@/assets/images/notInterest.svg?react";
import { useState } from "react";

export default function StockCard({ interest }) {
  const [isInterest, setIsInterest] = useState(interest);

  return (
    <Card>
      <Logo />
      <TextBox>
        <Name>삼성전자</Name>
        <Detail>
          <Number>005930</Number>
          <Price>87000(+10.5%)</Price>
        </Detail>
      </TextBox>
      <Interest onClick={() => setIsInterest(!isInterest)}>
        {isInterest ? <RedHeart /> : <GrayHeart />}
      </Interest>
    </Card>
  );
}
const Card = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--Spacing-XL, 24px);
  align-self: stretch;
  width: 100%;
`;
const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 33px;
  background: var(--Primary-900, #263c54);
`;
const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;
const Detail = styled.div`
  display: flex;
  gap: 12px;
`;
const Name = styled.div`
  color: var(--Neutral-900, #333);

  /* Body-Medium */
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  align-self: stretch;
  margin-bottom: 8px;
`;
const Number = styled.div`
  color: var(--Neutral-300, #b0b0b0);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`;
const Price = styled.div`
  color: var(--Alert-Red, #ff2e4e);

  /* Caption-Regular */
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
`;
const Interest = styled.div`
  display: flex;
  margin-left: auto;
`;
