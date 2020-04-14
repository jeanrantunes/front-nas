const INITIAL_STATE = {
   data: [],
   filter: null,
   loading: false,
   error: false,
}

export default function patients(state = INITIAL_STATE, action) {
   switch (action.type) {
      case 'ADD_PATIENT':
         return { ...state, loading: true }
      case 'REMOVE_PATIENT':
         return { ...state, loading: true }
      case 'UPDATE_PATIENT':
         return { ...state, loading: true }
      case 'REQUEST_PATIENT':
         return { filter: action.payload.filter, ...state, loading: true }
      case 'SUCCESS_PATIENT':
         return { data: action.payload.data, loading: false, error: false, filter: null }
      case 'FAILURE_PATIENT':
         return { ...state, loading: false, error: true, filter: null }
      default:
         return state
   }
}
