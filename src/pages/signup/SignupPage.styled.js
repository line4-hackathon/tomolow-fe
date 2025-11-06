import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 32px 16px;
`
export const Text = styled.p`
  white-space: pre-line;
  color: var(--Neutral-900, #333);
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
`

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
`
export const Space = styled.div`
  margin: 36px 0 52px 0;
`
export const FieldSpace = styled.div`
  height: 52px;
`
export const StatusRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`

export const NextButton = styled.div`
  margin-top: auto;
`
