'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface DeleteContextType {
  enableDelete: boolean
  setEnableDelete: (enable: boolean) => void
}

const DeleteContext = createContext<DeleteContextType | undefined>(undefined)

export const DeleteProvider = ({ children }: { children: ReactNode }) => {
  const [enableDelete, setEnableDelete] = useState(false)

  return (
    <DeleteContext.Provider value={{ enableDelete, setEnableDelete }}>
      {children}
    </DeleteContext.Provider>
  )
}

export const useDelete = () => {
  const context = useContext(DeleteContext)
  if (!context) {
    throw new Error('useDelete must be used within a DeleteProvider')
  }
  return context
}