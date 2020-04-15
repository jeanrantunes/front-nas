export function requestPatients(filter) {
   return {
      type: 'REQUEST_PATIENT',
      payload: {
         filter
      }
   }
}

export function addPatient(data) {
   return {
      type: 'ADD_PATIENT',
      payload: {
         data
      }
   }
}

export function updatePatient(data) {
   return {
      type: 'UPDATE_PATIENT',
      payload: {
         data
      }
   }
}

export function removePatient(data) {
   return {
      type: 'REMOVE_PATIENT',
      payload: {
         data
      }
   }
}
