import styled from 'styled-components'

export const HeaderBar = styled.header`
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  padding: 18px 16px;
  background: var(--Neutral-0, #FFF);
  border-bottom: 0.5px solid var(--Neutral-100, #e7e7e7);
`

export const Icon = styled.img`
  cursor: pointer;
`

export const Title = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #333333;
`

export const Spacer = styled.div`
  width: 24px;
  height: 24px;
`
