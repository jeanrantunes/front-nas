const INITIAL_STATE = {
   data: [],
   metadata: null,
   filter: null,
   loading: true,
   error: false
}

export default function nas(state = INITIAL_STATE, action) {
   switch (action.type) {
      case 'ADD_NAS':
         return { ...state, data: action.payload.data, loading: true }
      case 'REMOVE_NAS':
         return { ...state, loading: true }
      case 'UPDATE_NAS':
         return { ...state, loading: true }
      case 'REQUEST_NAS':
         return { ...state, filter: action.payload.filter, loading: true }
      case 'SUCCESS_NAS':
         console.log(action.payload.data)
         return {
            data: action.payload.data,
            metadata: action.payload.metadata,
            loading: false,
            error: false,
            filter: action.payload.filter || null
         }
      case 'FAILURE_NAS':
         console.log(123)
         return {
            ...state,
            loading: false,
            error: true,
            filter: null
         }
      default:
         return state
   }
}
