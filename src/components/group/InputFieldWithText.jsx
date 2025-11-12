import React from 'react'
import styled from 'styled-components'

function InputFieldWithText({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  rightText,
}) {
  return (
    <Field>
      <Label>{label}</Label>
      <FieldRow>
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <RightText>{rightText}</RightText>
      </FieldRow>
    </Field>
  )
}

export default InputFieldWithText

const Field = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Label = styled.p`
  color: var(--Neutral-900, #333);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  padding: 0 0 4px 0;
`

const FieldRow = styled.div`
  position: relative;
  width: 100%;
`

const Input = styled.input`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid var(--Neutral-200, #d1d1d1);
  outline: none;
  font-size: 16px;
  line-height: 24px;
  transition: border-color 0.2s ease;
  border-radius: 0;

  &:focus {
    border-bottom: 1px solid var(--Primary-500, #4880af);
  }
`
const RightText = styled.p`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: var(--Neutral-900, #333);
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
`
