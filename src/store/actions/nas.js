export function requestNas(filter) {
   return {
      type: 'REQUEST_NAS',
      payload: {
         filter
      }
   }
}

export function addNas(data) {
   return {
      type: 'ADD_NAS',
      payload: {
         data
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
