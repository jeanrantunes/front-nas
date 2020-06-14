import React, { useContext, useState, useLayoutEffect } from 'react'
import { useAsync } from 'react-async'

import api from '../services/api'
import { setToken, clearToken, getToken, setFirstTime } from '../helpers/token'
import Loader from '../components/Loader'

const getUserByToken = async () => {
   const token = getToken()
   if (!token) {
      return { user: null }
   }
   try {
      const { data: user } = await api.get('v1/me')
      return { user }
   } catch (error) {
      throw new Error(error)
   }
}

const AuthContext = React.createContext()

const AuthProvider = props => {
   const [requestItsFinished, setRequestItsFinished] = useState(false)
   const {
      data = { user: null },
      isSettled,
      isPending,
      isRejected,
      reload
   } = useAsync({
      promiseFn: getUserByToken
   })

   useLayoutEffect(() => {
      if (isSettled) {
         setRequestItsFinished(true)
      }
   }, [isSettled])

   if (!requestItsFinished) {
      if (isPending) {
         return <Loader />
      } else if (isRejected) {
         return <h2>redirect login</h2>
      }
   }

   const login = async data => {
      try {
         const { firstTime } = data
         const response = await api.post('v1/users/login', data)
         const { token, ...user } = response.data
         setToken(token)
         reload()
         window.location.href = '/'
         if (firstTime) {
            setFirstTime()
         }
         return { user }
      } catch (err) {
         // console.log(err)
         clearToken()
         return Promise.reject(err)
      }
   }

   const signup = async data => {
      try {
         const response = await api.post('v1/users/signup', data)
         const user = response.data
         reload()
         return { user }
      } catch (err) {
         clearToken()
         return err
      }
   }

   const updateUser = async data => {
      const { id, token, ...rest } = data
      setToken(token)
      try {
         const { data: user } = await api.put(`v1/users/${id}`, rest)
         return { user }
      } catch (err) {
         clearToken()
         return err
      }
   }

   const logout = () => {
      clearToken()
      reload()
      return
   }

   return (
      <AuthContext.Provider
         value={{ login, logout, signup, updateUser, data }}
         {...props}
      />
   )
}

const useAuth = () => {
   const context = useContext(AuthContext)
   if (!context) {
      throw new Error('useUser must be used within a AuthProvider')
   }
   return context
}

export { AuthProvider, useAuth }
