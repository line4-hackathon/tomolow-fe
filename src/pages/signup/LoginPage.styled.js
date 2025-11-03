import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  gap: 20px;
`

export const Img = styled.img``

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
  gap: 24px;
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
