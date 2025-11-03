import React from 'react'
import styled from 'styled-components'

function InputField({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <Field>
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
    </Field>
  )
}

export default InputField

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const Label = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  padding-bottom: 4px;
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
