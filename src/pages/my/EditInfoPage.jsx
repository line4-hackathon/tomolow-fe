import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import { Scrollable } from '@/styles/Scrollable.styled'
import * as S from '@/pages/signup/SignupPage.styled'
import InputField from '@/components/common/InputField'
import InputFieldWithButton from '@/components/common/InputFieldWithButton'
import StatusMessage from '@/components/common/StatusMessage'
import LargeButton from '@/components/signup/LargeButton'
import MenuBar from '@/components/common/MenuBar'

const checkStatus = (isValid, isTouched) => (!isTouched ? 'default' : isValid ? 'success' : 'error')

const EditInfoPage = () => {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [nicknameTouched, setNicknameTouched] = useState(false)
  const [isNicknameChecked, setIsNicknameChecked] = useState(false)

  const [password1, setPassword1] = useState('')
  const [password1Touched, setPassword1Touched] = useState(false)
  const [password2, setPassword2] = useState('')
  const [password2Touched, setPassword2Touched] = useState(false)

  // 닉네임 길이 체크
  const isNicknameValid = nickname.length > 1 && nickname.length < 10
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

  // 필드 상태값 계산 후 함수에 전달
  const nicknameStatus = checkStatus(isNicknameValid, nicknameTouched)
  const passwordStatus = checkStatus(hasLetter && hasNumber, password1Touched)
  const passwordConfirmStatus = checkStatus(isMatched, password2Touched)

  const handleSubmit = () => {
    if (!finalCheck) return
    navigate('/mypage')
  }

  return (
    <>
      <Scrollable>
        <Header title='정보수정' showIcon={true} path='/mypage' />
        <S.Container>
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
          <S.FieldSpace></S.FieldSpace>
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
          <StatusMessage status={passwordConfirmStatus} text={'비밀번호 일치'} />
          <S.NextButton>
            <LargeButton
              label='완료'
              color='#fff'
              backgroundcolor={finalCheck ? '#4880AF' : '#D1D1D1'}
              onClick={handleSubmit}
            />
          </S.NextButton>
        </S.Container>
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default EditInfoPage
