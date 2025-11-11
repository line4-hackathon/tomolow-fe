import React from 'react'
import styled from 'styled-components'
import ImgLoading from '@/assets/images/image-loading.svg?react'

const Loading = () => {
  return (
    <LoadingContainer>
      <ImgLoading />
    </LoadingContainer>
  )
}

export default Loading

const LoadingContainer = styled.div`
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
