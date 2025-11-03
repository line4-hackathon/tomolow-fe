import styled from "styled-components"

import BackButton from "@/assets/images/backButton.svg?react";
import RedHeart from "@/assets/images/isInterest.svg?react";
import GrayHeart from "@/assets/images/notInterest.svg?react";
import StockInfo from "@/components/invest/stockInfo";
import Chart from "@/components/invest/chart";
import Etc from "@/components/invest/etc";

export default function InvestTradingPage(){
    return(
        <Page>
            <Header>
                <BackButton/>
                <HeaderInfo>
                    <HeadName>
                        삼성전자
                    </HeadName>
                    <HeadPrice>
                        117,000원(+10.5%)
                    </HeadPrice>    
                </HeaderInfo>
                <GrayHeart/>
            </Header>
            <Contents>
                <StockInfo/>
                <Chart/>
                <Etc/>
            </Contents>
        </Page>
    )
}

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;
const Header=styled.header`
    display: flex;
    width: 343px;
padding: 10px 16px;
justify-content: space-between;
align-items: center;
border-bottom: 0.5px solid var(--Neutral-100, #E7E7E7);
background: var(--Neutral-0, #FFF);
`
const HeaderInfo=styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`
const HeadName=styled.div`
    color: var(--Neutral-900, #333);
text-align: center;

/* Body-Medium */
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 24px; /* 150% */
`
const HeadPrice=styled.div`
    color: var(--Alert-Red, #FF2E4E);

/* Caption-Regular */
font-family: Inter;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: 16px; /* 133.333% */
`
const Contents=styled.div`
    display: flex;
    flex-direction: column;
`
