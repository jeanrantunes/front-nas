import React, { useContext } from 'react'

import { useAuth } from './auth'

const UserContext = React.createContext()

const UserProvider = props => {
   const { data: user } = useAuth()
   return <UserContext.Provider value={user} {...props} />
}

const useUser = () => {
   const context = useContext(UserContext)
   if (!context) {
      throw new Error('useUser must be used within a UserProvider')
   }
   return context
}

export { UserProvider, useUser }
