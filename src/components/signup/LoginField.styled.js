import styled from 'styled-components'

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
  gap: 24px;
`

export const Field = styled.div``

export const Label = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`

export const Input = styled.input`
  width: 100%;
  padding: 8px 0;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border: none;
  border-bottom: 1px solid var(--Neutral-200, #d1d1d1);
  outline: none;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  transition: border-color 0.2s ease;

  &:focus {
    border-bottom: 1px solid var(--Primary-500, #4880af);
  }
`

export const SignupButton = styled.button`
  width: fit-content;
  margin: 0 auto;
  border: none;
  background-color: #ffffff;
  color: var(--Neutral-300, #b0b0b0);
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  cursor: pointer;
`
export const LoginButton = styled.div`
  margin-top: auto;
`
