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

const EditInfoPage = () => {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [nicknameStatus, setNicknameStatus] = useState({
    duplicate: false,
    length: false,
  })
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [passwordStatus, setPasswordStatus] = useState({
    hasLetter: false,
    hasNumber: false,
    isMatched: false,
  })

  const isValid =
    nicknameStatus.duplicate &&
    nicknameStatus.length &&
    passwordStatus.hasLetter &&
    passwordStatus.hasNumber &&
    passwordStatus.isMatched

  const handleSubmit = () => {
    if (isValid) {
      navigate('/mypage')
    }
  }
  // 닉네임 길이 체크
  useEffect(() => {
    setNicknameStatus((prev) => ({
      ...prev,
      length: nickname.length > 1 && nickname.length < 10,
    }))
  }, [nickname])

  // 비밀번호 검증
  useEffect(() => {
    setPasswordStatus({
      hasLetter: /[a-zA-Z]/.test(password1),
      hasNumber: /\d/.test(password1),
      isMatched: password1 !== '' && password1 === password2,
    })
  }, [password1, password2])

  // 닉네임 중복 체크 임시 코드(연동 필요)
  const checkNickname = () => {
    setNicknameStatus((prev) => ({ ...prev, duplicate: true }))
    console.log('중복되지 않은 닉네임')
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
            buttonText='중복 확인'
            active={nickname.length < 10 && nickname.length > 1}
            onClick={checkNickname}
          />
          <S.StatusRow>
            <StatusMessage
              status={nicknameStatus.duplicate ? 'success' : 'default'}
              text='중복 여부'
            />
            <StatusMessage
              status={nicknameStatus.length ? 'success' : 'default'}
              text='10자 이내'
            />
          </S.StatusRow>
          <S.FieldSpace></S.FieldSpace>
          <InputField
            label='비밀번호'
            type='password'
            placeholder='비밀번호 입력'
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
          <S.StatusRow>
            <StatusMessage
              status={passwordStatus.hasLetter ? 'success' : 'default'}
              text='영문 포함'
            />
            <StatusMessage
              status={passwordStatus.hasNumber ? 'success' : 'default'}
              text='숫자 포함'
            />
          </S.StatusRow>
          <InputField
            label=''
            type='password'
            placeholder='비밀번호 확인'
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <StatusMessage
            status={passwordStatus.isMatched ? 'success' : 'default'}
            text={'비밀번호 일치'}
          />

          <S.NextButton>
            <LargeButton
              label='완료'
              color='#fff'
              backgroundcolor={isValid ? '#4880AF' : '#D1D1D1'}
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
