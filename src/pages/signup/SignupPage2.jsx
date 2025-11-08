import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from '@/pages/signup/SignupPage.styled'
import Header from '@/components/common/Header'
import InputField from '@/components/common/InputField'
import InputFieldWithButton from '@/components/common/InputFieldWithButton'
import StatusMessage from '@/components/common/StatusMessage'
import LargeButton from '@/components/signup/LargeButton'

// Status Message 상태 업데이트
const checkStatus = (isValid, isTouched) => (!isTouched ? 'default' : isValid ? 'success' : 'error')

const SignupPage2 = () => {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [nicknameTouched, setNicknameTouched] = useState(false)
  const [isNicknameValid, setIsNicknameValid] = useState(false) // 글자수 확인
  const [isNicknameChecked, setIsNicknameChecked] = useState(false) // 중복여부 체크

  const [password1, setPassword1] = useState('')
  const [password1Touched, setPassword1Touched] = useState(false)
  const [password2, setPassword2] = useState('')
  const [password2Touched, setPassword2Touched] = useState(false)

  useEffect(() => {
    setIsNicknameValid(nickname.length < 10 && nickname.length > 1)
  }, [nickname])

  // 닉네임 중복 확인 체크
  const checkNickname = () => {
    if (isNicknameValid) {
      setIsNicknameChecked(true)
    } else {
      setIsNicknameChecked(false)
      console.log('닉네임을 다시 확인해주세요')
    }
  }

  // 패스워드 체크
  const hasLetter = /[a-zA-Z]/.test(password1)
  const hasNumber = /\d/.test(password1)
  const isMatched = password1 && password1 === password2
  const finalCheck = isNicknameValid && isNicknameChecked && hasLetter && hasNumber && isMatched

  // 필드 상태값 계산 후 전달
  const nicknameStatus = checkStatus(isNicknameValid, nicknameTouched)
  const passwordStatus = checkStatus(hasLetter && hasNumber, password1Touched)
  const passwordConfirmStatus = checkStatus(isMatched, password2Touched)

  const handleSubmit = () => {
    if (finalCheck) {
      navigate('/')
    }
  }

  return (
    <>
      <Header title='회원가입' showIcon={true} path='/signup/1' />
      <S.Container>
        <S.Text>{`TomoLow 이용을 위해\n 회원 정보를 입력해주세요`}</S.Text>
        <S.Space>
          <InputFieldWithButton
            label='닉네임'
            type='text'
            placeholder='닉네임 입력'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onBlur={() => setNicknameTouched(true)}
            buttonText='중복 확인'
            active={isNicknameValid}
            onClick={checkNickname}
          />
          <S.StatusRow>
            <StatusMessage
              status={checkStatus(isNicknameChecked, nicknameTouched)}
              text='중복 여부'
            />
            <StatusMessage status={nicknameStatus} text='10자 이내' />
          </S.StatusRow>
        </S.Space>
        <InputField
          label='비밀번호'
          type='password'
          placeholder='비밀번호 입력'
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          onBlur={() => setPassword1Touched(true)}
        />
        <S.StatusRow>
          <StatusMessage status={checkStatus(hasLetter, password1Touched)} text='영문 포함' />
          <StatusMessage status={checkStatus(hasNumber, password1Touched)} text='숫자 포함' />
        </S.StatusRow>
        <InputField
          label=''
          type='password'
          placeholder='비밀번호 확인'
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          onBlur={() => setPassword2Touched(true)}
        />
        <StatusMessage status={passwordConfirmStatus} text='비밀번호 일치' />{' '}
        <S.NextButton>
          <LargeButton
            label='완료'
            color='#fff'
            backgroundcolor={finalCheck ? '#4880AF' : '#D1D1D1'}
            onClick={handleSubmit}
          />
        </S.NextButton>
      </S.Container>
    </>
  )
}

export default SignupPage2
