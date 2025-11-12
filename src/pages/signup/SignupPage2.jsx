import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/common/Header'
import Form from '@/components/common/Form'
import MenuBar from '@/components/common/MenuBar'

const SignupPage2 = () => {
  const location = useLocation()
  const { name, mail } = location.state || {}
  return (
    <>
      <Header title='회원가입' showIcon={true} path='/signup/1' />
      <Form mode='signup' name={name} mail={mail} />
    </>
  )
}

export default SignupPage2
