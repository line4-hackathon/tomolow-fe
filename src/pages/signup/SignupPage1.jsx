import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import * as S from './SignupPage.styled'
import Header from '@/components/common/Header'
import LargeButton from '@/components/signup/LargeButton'
import StatusMessage from '@/components/common/StatusMessage'
import InputField from '@/components/signup/InputField'
import InputFieldWithButton from '@/components/signup/InputFieldWithButton'

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

  // 인증 코드 확인
  const checkCode = () => {
    if (code === '1234') {
      setCodeStatus('success')
      setCodeText('인증 완료')
    } else {
      setCodeStatus('error')
      setCodeText('인증번호가 올바르지 않습니다')
    }
  }

  // 다음 페이지 이동
  const handleSubmit = () => {
    if (codeStatus === 'success') {
      navigate('/signup/2')
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
          <InputFieldWithButton
            label='아이디(이메일)'
            type='email'
            placeholder='이메일 입력'
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            buttonText='인증번호 전송'
            active={isMailValid}
            onClick={() => console.log('이메일 인증번호 전송')}
          />

          <InputFieldWithButton
            label=''
            type='text'
            placeholder='인증번호 입력'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            buttonText='확인'
            active={code.length > 0}
            onClick={checkCode}
          />

          <StatusMessage status={codeStatus} text={codeText} />
          <S.NextButton>
            <LargeButton
              label='다음'
              color='#fff'
              backgroundcolor={codeStatus === 'success' ? '#4880AF' : '#D1D1D1'}
              onClick={handleSubmit}
            />
          </S.NextButton>
        </S.FormContainer>
      </S.Container>
    </>
  )
}

export default SignupPage
