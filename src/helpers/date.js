const options = { year: '2-digit', month: 'short', day: 'numeric' }
const options2 = {
   weekday: 'long',
   month: 'long',
   year: 'numeric',
   day: 'numeric',
   hour: '2-digit',
   minute: '2-digit'
}

export const combineDateAndTime = (date, time) => {
   if (!date || !time) {
      return
   }
   const dateIsoStr = new Date(date).toISOString()
   const dateStr = dateIsoStr.slice(0, dateIsoStr.indexOf('T'))
   const timeIsoStr = new Date(time).toISOString()
   const timeStr = timeIsoStr.slice(timeIsoStr.indexOf('T'), timeIsoStr.length)

   return new Date(dateStr + timeStr)
}

export const age = birthday => {
   const diff = Date.now() - new Date(birthday).getTime()
   const age = new Date(diff)

   return Math.abs(age.getUTCFullYear() - 1970)
}

export const howManyDays = date => {
   const diff = Date.now() - new Date(date).getTime()
   const time = new Date(diff)

   return Math.floor(time / (1000 * 3600 * 24))
}

export const formatPTDate = date => {
   if (!date) {
      return new Date().toLocaleDateString('pt-br', options)
   }
   return new Date(date).toLocaleDateString('pt-br', options)
}

export const formatPTDateTime = date => {
   if (!date) {
      return new Date().toLocaleString('pt-br', options2)
   }
   return new Date(date).toLocaleString('pt-br', options2)
}

export const isItBirthday = date => {
   if (!date) {
      return false
   }
   const birthday = new Date(date)
   const today = new Date()

   return (
      today.getDate() === birthday.getDate() &&
      today.getMonth() === birthday.getMonth()
   )
}

export const getDateInCurrentTimeZone = date => {
   const dt = new Date(date)
   dt.setMinutes(dt.getMinutes() - new Date().getTimezoneOffset())
   return dt
}
