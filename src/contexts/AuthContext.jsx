import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// 로그인 여부 확인
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      setIsLoggedIn(true)
    }
  }, [])

  const login = (accessToken) => {
    localStorage.setItem('accessToken', accessToken)
    setIsLoggedIn(true)
  }

  return <AuthContext.Provider value={{ isLoggedIn, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
