import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import * as S from './SignupPage.styled'
import Header from '@/components/common/Header'
import LargeButton from '@/components/signup/LargeButton'
import StatusMessage from '@/components/common/StatusMessage'
import InputField from '@/components/common/InputField'
import InputFieldWithButton from '@/components/common/InputFieldWithButton'

const SignupPage = () => {
  const [name, setName] = useState('')
  const [mail, setMail] = useState('')
  const [code, setCode] = useState('')
  const [codeStatus, setCodeStatus] = useState('default') // default, success, error
  const [codeText, setCodeText] = useState('인증 완료')

  const navigate = useNavigate()

  // 이메일 정규식
  const mailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i
  const isMailValid = mailRegEx.test(mail)

  // 다음 페이지 이동
  const handleSubmit = () => {
    if (name && isMailValid) {
      navigate('/signup/2', { state: { name, mail } }) // name과 mail 다음 페이지로 넘기기
    }
  }

  return (
    <>
      <Header title='회원가입' showIcon={true} path='/login' />
      <S.Container>
        <S.Text>{`TomoLow 이용을 위해\n회원 정보를 입력해주세요`}</S.Text>

        <S.FormContainer>
          <S.Space>
            <InputField
              label='이름'
              type='text'
              placeholder='이름 입력'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </S.Space>
          <InputField
            label='아이디(이메일)'
            type='email'
            placeholder='이메일 입력'
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
          <S.NextButton>
            <LargeButton
              label='다음'
              color='#fff'
              backgroundcolor={name && isMailValid ? '#4880AF' : '#D1D1D1'}
              onClick={handleSubmit}
            />
          </S.NextButton>
        </S.FormContainer>
      </S.Container>
    </>
  )
}

export default SignupPage
