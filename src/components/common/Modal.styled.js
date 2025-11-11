import styled from 'styled-components'

export const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`
export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 252px;
  max-width: 252px;

  padding: 24px 16px;
  gap: 24px;
  border-radius: var(--Radius-M, 12px);
  background: var(--Neutral-0, #fff);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.08);
`

export const Title = styled.p`
  color: var(--Neutral-900, #333);
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  white-space: pre-line;
`

export const Text = styled.p`
  color: var(--Neutral-900, #333);
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  white-space: pre-line;
`

export const Input = styled.input`
  border: none;
  border-radius: var(--Radius-M, 12px);
  background: var(--Primary-100, #e8eef6);
  padding: 12px 15px;
  font-size: 14px;
  outline: none;
`
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
