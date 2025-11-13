import React, { useState } from 'react'
import styled from 'styled-components'
import eyeOn from '@/assets/icons/icon-eye-on.svg'
import eyeOff from '@/assets/icons/icon-eye-off.svg'

function InputField({ label, type = 'text', placeholder, value, onChange, onBlur }) {
  const [seePassword, setSeePassword] = useState(false)
  const isVisible = type === 'password'

  const handlePassword = () => {
    setSeePassword((prev) => !prev)
  }
  return (
    <Field>
      <Label>{label}</Label>
      <InputContainer>
        <Input
          type={isVisible && seePassword ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        {isVisible && (
          <Button onClick={handlePassword}>
            <Icon src={seePassword ? eyeOn : eyeOff} />
          </Button>
        )}
      </InputContainer>
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

const InputContainer = styled.div`
  position: relative;
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
  border-radius: 0;

  &:focus {
    border-bottom: 1px solid var(--Primary-500, #4880af);
  }
`

const Button = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  border: none;
  background-color: #fff;
`

const Icon = styled.img``
