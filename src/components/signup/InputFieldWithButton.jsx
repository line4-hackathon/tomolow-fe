import React from 'react'
import styled from 'styled-components'

function InputFieldWithButton({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  buttonText,
  onClick,
  active = false,
}) {
  return (
    <Field>
      <Label>{label}</Label>
      <FieldRow>
        <Input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        <SmallButton type='button' $active={active} disabled={!active} onClick={onClick}>
          {buttonText}
        </SmallButton>
      </FieldRow>
    </Field>
  )
}

export default InputFieldWithButton

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
  padding: 16px 0;
  border: none;
  border-bottom: 1px solid var(--Neutral-200, #d1d1d1);
  outline: none;
  font-size: 16px;
  line-height: 24px;
  transition: border-color 0.2s ease;

  &:focus {
    border-bottom: 1px solid var(--Primary-500, #4880af);
  }
`

const SmallButton = styled.button`
  position: absolute;
  right: 0;
  padding: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#4880AF' : '#E7E7E7')};
  color: ${({ $active }) => ($active ? '#fff' : '#6d6d6d')};
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'default')};
`
