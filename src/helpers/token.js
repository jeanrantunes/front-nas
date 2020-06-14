export const getToken = () => localStorage.getItem('token')

export const setToken = token => localStorage.setItem('token', token)

export const clearToken = token => localStorage.removeItem('token')

export const setItsFirstTime = () => localStorage.setItem('firstTime', true)

export const getFirstTime = () => localStorage.getItem('firstTime')

export const setFirstTime = () => localStorage.setItem('firstTime', true)

export const clearFirstTime = () => localStorage.removeItem('firstTime')

export const getTransitionSteps = () => localStorage.getItem('transitionSteps')

export const setTransitionSteps = () =>
   localStorage.setItem('transitionSteps', true)

export const clearTransitionSteps = () =>
   localStorage.removeItem('transitionSteps')
