import { createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'

const TypeContext = createContext('personal') // 타입 personal로 초기화

export const TypeProvider = ({ children }) => {
  const location = useLocation()
  const isGroup = location.pathname.startsWith('/group') // url 경로로 타입 판단
  const type = isGroup ? 'group' : 'personal'

  return <TypeContext.Provider value={type}>{children}</TypeContext.Provider>
}

export const useType = () => {
  return useContext(TypeContext)
}

export default TypeProvider
