import styled from "styled-components"

import StockInfo from "@/components/invest/stockInfo";
import Chart from "@/components/invest/chart";
import Etc from "@/components/invest/etc";
import InvestHeader from "@/components/invest/InvestHeader";

export default function InvestTradingPage(){
    return(
        <Page>
            <InvestHeader/>
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
const Contents=styled.div`
    display: flex;
    flex-direction: column;
`
