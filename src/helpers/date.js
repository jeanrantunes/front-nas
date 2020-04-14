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
