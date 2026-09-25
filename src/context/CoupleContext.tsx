import { createContext, useContext } from 'react'
import type { Couple } from '../types/models'

export const CoupleContext = createContext<Couple | null>(null)

export const useCouple = () => {
  return useContext(CoupleContext)
}
