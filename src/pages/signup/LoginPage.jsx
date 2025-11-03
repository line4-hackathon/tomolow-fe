import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from '@/pages/signup/LoginPage.styled'
import Header from '@/components/common/Header'
import Slogan from '@/components/signup/Slogan'
import Logo from '@/assets/images/logo-login.svg'
import InputField from '@/components/signup/InputField'
import LargeButton from '@/components/signup/LargeButton'
import ToastMessage from '@/components/signup/ToastMessage'

const LoginPage = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/signup/1')
  }

  // 연동
  const handleSubmit = () => {
    // 로그인 실패 시 토스트 메세지
    if (!id || !password) {
      setToastMessage('아이디 또는 비밀번호를 확인하세요')
      return
    }
  }

  return (
    <>
      <Header title='로그인' />
      <S.Container>
        <Slogan />
        <S.Img src={Logo} alt='Logo' />

        <S.FormContainer>
          <InputField
            label='아이디'
            type='text'
            placeholder='아이디'
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <InputField
            label='비밀번호'
            type='password'
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <S.SignupButton onClick={handleClick}>회원가입</S.SignupButton>
          <S.LoginButton>
            <LargeButton
              label='로그인'
              color='#fff'
              backgroundcolor='#4880AF'
              onClick={handleSubmit}
            />
          </S.LoginButton>
        </S.FormContainer>

        {toastMessage && <ToastMessage msg={toastMessage} onClose={() => setToastMessage('')} />}
      </S.Container>
    </>
  )
}

export default LoginPage
