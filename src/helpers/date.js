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
