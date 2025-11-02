import React from 'react'
import styled from 'styled-components'
import Slogan from './Slogan'
import Logo from '@/assets/images/logo-login.svg'
import LoginField from './LoginField'

const MainLogin = () => {
  return (
    <Container>
      <Slogan />
      <Img src={Logo} alt='Logo' />
      <LoginField />
    </Container>
  )
}

export default MainLogin

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  gap: 20px;
`

const Img = styled.img``
