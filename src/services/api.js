import { getToken } from '../helpers/token'
import axios from 'axios'

const api = axios.create({
   // baseURL: process.env.REACT_APP_BASE_URL_BASE_URL || 'http://localhost:3001'
   baseURL: 'https://nas-api.herokuapp.com/'
})

api.interceptors.request.use(async config => {
   const token = getToken()
   return {
      ...config,
      headers: {
         ...config.headers,
         Authorization: token ? `Bearer ${token}` : ''
      }
   }
})

api.interceptors.response.use(
   response => {
      return response
   },
   error => {
      if (
         error &&
         error.response &&
         error.response.status === 401 &&
         window.location.pathname !== '/login' &&
         window.location.pathname !== '/signup-confirm'
      ) {
         window.location.href = '/login'
         return
      }
      return Promise.reject(error)
   }
)

export default api
