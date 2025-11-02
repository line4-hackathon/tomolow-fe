import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from './LoginField.styled'
import LargeButton from './LargeButton'
import Toast from './Toast'

const LoginField = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/signup')
  }

  // 연동
  const handleSubmit = () => {
    // 로그인 실패 시, 토스트 메세지 띄우기
    if (!id || !password) {
      setToastMessage('아이디 또는 비밀번호를 확인하세요')
      return
    }
  }
  return (
    <S.FormContainer>
      <S.Field>
        <S.Label>아이디</S.Label>
        <S.Input
          type='text'
          placeholder='아이디'
          value={id}
          onChange={(e) => {
            setId(e.target.value)
          }}
        />
      </S.Field>
      <S.Field>
        <S.Label>비밀번호</S.Label>
        <S.Input
          type='password'
          placeholder='비밀번호'
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </S.Field>
      <S.SignupButton onClick={handleClick}>회원가입</S.SignupButton>
      <S.LoginButton>
        <LargeButton label='로그인' color='#fff' backgroundcolor='#4880AF' onClick={handleSubmit} />
      </S.LoginButton>
      {toastMessage && <Toast msg={toastMessage} onClose={() => setToastMessage('')} />}
    </S.FormContainer>
  )
}

export default LoginField
