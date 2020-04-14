import { getToken } from '../helpers/token'
import axios from 'axios'

const base_url = 'http://localhost:3001'

const api = axios.create({
   baseURL: base_url,
})

api.interceptors.request.use(async config => {
   const token = getToken()
   return {
      ...config,
      headers: {
         ...config.headers,
         Authorization: token ? `Bearer ${token}` : '',
      },
   }
})

api.interceptors.response.use(
   response => {
      return response
   },
   error => {
      if (error && error.response && error.response.status === 401 && window.location.pathname !== '/login') {
         window.location.href = '/login'
         return
      }
      return Promise.reject(error)
   },
)

export default api
