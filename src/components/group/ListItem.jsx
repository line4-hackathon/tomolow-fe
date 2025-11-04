import React from 'react'
import styled from 'styled-components'

function ListItem({ title, dateTxt, statusTxt, onClick }) {
  return (
    <Container onClick={onClick}>
      <TextContainer>
        <Title>{title}</Title>
        <Date>{dateTxt}</Date>
      </TextContainer>
      <Status>{statusTxt}</Status>
    </Container>
  )
}

export default ListItem

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: var(--Radius-L, 16px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
  cursor: pointer;
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Title = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`

export const Date = styled.p`
  color: var(--Neutral-500, #6d6d6d);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
`

export const Status = styled.p`
  color: var(--Neutral-900, #333);
  text-align: right;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
`
