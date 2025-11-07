import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 32px 16px;
  background: var(--Neutral-50, #f6f6f6);
  overflow-y: auto;
`

export const NameContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: end;
  gap: 4px;
  padding-bottom: 32px;
`

export const Name = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`

export const Span = styled.span`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`
export const MoneyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: var(--Spacing-L, 16px);
  background: var(--Primary-200, #ccdceb);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  padding: 16px;
`
export const Label = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`

export const Money = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 24px 0;
  padding: 24px 16px;
  gap: 32px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`
export const Logout = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  cursor: pointer;
`
