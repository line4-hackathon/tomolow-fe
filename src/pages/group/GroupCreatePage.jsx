import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from './GroupCreatePage.styled'
import Header from '@/components/common/Header'
import InputField from '@/components/common/InputField'
import InputFieldWithText from '@/components/group/InputFieldWithText'
import StatusMessage from '@/components/common/StatusMessage'
import LargeButton from '@/components/signup/LargeButton'

const checkStatus = (isValid, isTouched) => (!isTouched ? 'default' : isValid ? 'success' : 'error')

const GroupCreatePage = () => {
  const navigate = useNavigate()
  const [groupName, setGroupName] = useState('')
  const [groupNameTouched, setGroupNameTouched] = useState(false)

  const [money, setMoney] = useState('')
  const [moneyTouched, setMoneyTouched] = useState(false)

  const [memberCount, setMemberCount] = useState('')
  const [memberTouched, setMemberTouched] = useState(false)

  const [duration, setDuration] = useState('')
  const [durationTouched, setDurationTouched] = useState(false)

  // 각 필드 유효성 검사
  const isGroupNameValid = groupName.length > 0 && groupName.length <= 15
  const isMoneyValid = Number(money) >= 10000 && Number(money) <= 100000000
  const isMemberValid =
    Number.isInteger(Number(memberCount)) && Number(memberCount) >= 2 && Number(memberCount) <= 4
  const isDurationValid =
    Number.isInteger(Number(duration)) && Number(duration) >= 1 && Number(duration) <= 180

  // 필드 상태값 전달
  const groupNameStatus = checkStatus(isGroupNameValid, groupNameTouched)
  const moneyStatus = checkStatus(isMoneyValid, moneyTouched)
  const memberStatus = checkStatus(isMemberValid, memberTouched)
  const durationStatus = checkStatus(isDurationValid, durationTouched)

  // 버튼 활성화
  const allValid =
    groupNameStatus === 'success' &&
    moneyStatus === 'success' &&
    memberStatus === 'success' &&
    durationStatus === 'success'

  const handleSubmit = () => {
    navigate('/group/list')
  }

  return (
    <>
      <Header title='그룹 생성' showIcon={true} path='/group/list' />
      <S.Container>
        <S.FieldContainer>
          <S.Field>
            <InputField
              label={'그룹명'}
              placeholder={'그룹명 입력'}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onBlur={() => setGroupNameTouched(true)}
            />
            <StatusMessage status={groupNameStatus} text={'15자 이하'} />
          </S.Field>
          <S.Field>
            <InputFieldWithText
              label={'투자 시드머니 (참가비)'}
              type='number'
              placeholder={'숫자만 입력'}
              value={money}
              onChange={(e) => setMoney(e.target.value)}
              onBlur={() => setMoneyTouched(true)}
              rightText='원'
            />
            <StatusMessage status={moneyStatus} text={'1만원 이상 1억원 이하'} />
          </S.Field>
          <S.Field>
            <InputFieldWithText
              label={'인원'}
              type='number'
              placeholder={'숫자만 입력'}
              value={memberCount}
              onChange={(e) => setMemberCount(e.target.value)}
              onBlur={() => setMemberTouched(true)}
              rightText='명'
            />
            <StatusMessage status={memberStatus} text={'2인 이상 4인 이하'} />
          </S.Field>
          <S.Field>
            <InputFieldWithText
              label={'투자 기간'}
              type='number'
              placeholder={'숫자만 입력'}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              onBlur={() => setDurationTouched(true)}
              rightText='일'
            />
            <StatusMessage status={durationStatus} text={'1일 이상 180일 이하'} />
          </S.Field>
        </S.FieldContainer>
        <S.CreateButton>
          <LargeButton
            label='생성하기'
            color='#fff'
            backgroundcolor={allValid ? '#4880AF' : '#D1D1D1'}
            onClick={handleSubmit}
          />
        </S.CreateButton>
      </S.Container>
    </>
  )
}

export default GroupCreatePage
