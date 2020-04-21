export function requestNas(filter) {
   return {
      type: 'REQUEST_NAS',
      payload: {
         filter
      }
   }
}

export function removeNas(data) {
   return {
      type: 'REMOVE_NAS',
      payload: {
         data
      }
   }
}
