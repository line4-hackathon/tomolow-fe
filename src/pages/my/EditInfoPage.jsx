import React from 'react'
import { Scrollable } from '@/styles/Scrollable.styled'
import Header from '@/components/common/Header'
import Form from '@/components/common/Form'
import MenuBar from '@/components/common/MenuBar'

const EditInfoPage = () => {
  return (
    <>
      <Scrollable>
        <Header title='정보수정' showIcon={true} path='/mypage' />
        <Form mode='edit' buttonName='저장하기' />
      </Scrollable>
      <MenuBar />
    </>
  )
}

export default EditInfoPage
