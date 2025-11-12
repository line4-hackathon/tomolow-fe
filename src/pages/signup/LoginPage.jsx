import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import Header from '@/components/common/Header'
import Slogan from '@/components/signup/Slogan'
import Logo from '@/assets/images/logo-login.svg?react'
import InputField from '@/components/common/InputField'
import LargeButton from '@/components/signup/LargeButton'
import ToastMessage from '@/components/common/Toast'
import Loading from '@/components/common/Loading'

const LoginPage = () => {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const apiUrl = import.meta.env.VITE_API_BASE_URL
  const loginRequest = async () => {
    try {
      setLoading(true)
      const res = await axios.post(`${apiUrl}/api/auth/login`, { username: id, password })

      const { accessToken } = res.data.data
      localStorage.setItem('accessToken', accessToken)

      navigate('/home')
    } catch (err) {
      console.error(err)
      console.error('로그인 실패')
      setToastMessage('아이디 또는 비밀번호를 확인하세요')
    } finally {
      setLoading(false)
    }
  }

  // 연동
  const handleSubmit = () => {
    // 로그인 실패 시 토스트 메세지
    if (!id || !password) {
      setToastMessage('아이디 또는 비밀번호를 확인하세요')
      return
    }
    loginRequest()
  }

  const handleClick = () => {
    navigate('/signup/1')
  }

  if (loading) return <Loading />

  return (
    <>
      <Header title='로그인' />
      <Container>
        <Slogan />
        <Logo />

        <FormContainer>
          <InputField
            label='아이디(이메일)'
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
          <SignupButton onClick={handleClick}>회원가입</SignupButton>
          <LoginButton>
            <LargeButton
              label='로그인'
              color='#fff'
              backgroundcolor='#4880AF'
              onClick={handleSubmit}
            />
          </LoginButton>
        </FormContainer>

        {toastMessage && <ToastMessage msg={toastMessage} onClose={() => setToastMessage('')} />}
      </Container>
    </>
  )
}

export default LoginPage

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  gap: 20px;
`

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  width: 100%;
  gap: 24px;
`

const SignupButton = styled.button`
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
const LoginButton = styled.div`
  margin-top: auto;
  padding-top: 40px;
`
