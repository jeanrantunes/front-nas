const INITIAL_STATE = {
   data: [],
   metadata: null,
   filter: null,
   loading: false,
   error: false
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
         return {
            ...state,
            filter: action.payload.filter || null,
            loading: true
         }
      case 'SUCCESS_PATIENT':
         return {
            data: action.payload.data,
            metadata: action.payload.metadata,
            loading: false,
            error: false,
            filter: action.payload.filter || null
         }
      case 'FAILURE_PATIENT':
         return { ...state, loading: false, error: true, filter: null }
      default:
         return state
   }
}
