import styled from 'styled-components'

const S = {}

S.Container = styled.section`
  padding: 24px 16px 32px;
  background-color: #f6f6f6;
`

S.MoneyCharge = styled.div`
  display: flex;
  padding: 24px 7px 24px 16px;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
`

S.LeftBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
S.MoneyIcon = styled.img`
    width: 28px;
    height: 28px;
`

S.Label = styled.div`
  color: #333;
  font-size: 16px;
  font-weight: 500;
`

S.RightBox = styled.div`
  width: 24px;
  height: 24px;
`

S.Arrow = styled.img`
  width: 16px;
  height: 16px;
`

S.TabRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
`

S.TabButton = styled.button`
  border: none;
  background: transparent;
  padding: 0 0 8px;
  font-size: 20px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#2B5276' : '#B0B0B0')};
  border-bottom: ${({ $active }) =>
    $active ? '1px solid #1f3b70' : '1px solid transparent'};
`

S.CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

S.Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

S.Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

S.Thumbnail = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #263c54;
`

S.LeftText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

S.StockName = styled.div`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`

S.StockSub = styled.div`
  font-size: 12px;
  color: #6d6d6d;
`

S.Right = styled.div`
  display: flex;
  gap: 24px;
`

S.Price = styled.div`
  color: var(--Neutral-900, #333);
  text-align: right;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  gap: 8px;
  display: flex;
  flex-direction: column;
`

S.Diff = styled.div`
  font-size: 12px;
  text-align: right;
  font-weight: 400;
  line-height: 16px;
  color: ${({ $positive }) => ($positive ? '#ff2e4e' : '#2B5276')};
`

S.HeartButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
`

S.HeartIcon = styled.img`
  width: 22px;
  height: 22px;
`

S.EmptyState = styled.div`
  padding: 40px 0 24px;
  text-align: center;
  color: #c4c4c4;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
`

S.EmptyText = styled.div`
  color: var(--Neutral-300, #B0B0B0);
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

S.HeartEmpty = styled.img`
  width: 24px;
  height: 24px;
`

S.InvestButton = styled.button`
  display: flex;
  padding: 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: none;
  color: #ffffff;
  border-radius: var(--Radius-S, 8px);
  background: var(--Primary-500, #4880AF);
`

S.HoldCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

S.HoldRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

S.InterestCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

S.InterestRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

S.InterestPriceRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
`

S.InterestPrice = styled.div`
  font-size: 12px;
  color: ${({ $positive }) => ($positive ? '#ff2e4e' : '#2B5276')};
`

S.LeftBtnText = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`

S.Message = styled.div`
  color: #9ca3af;
  text-align: center;
  font-size: 14px;
  margin-top: 40px;
`

export default S