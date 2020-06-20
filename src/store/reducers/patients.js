import { rankingPatientsNas } from '../../utils/nas-func'
import { getDateInCurrentTimeZone } from '../../helpers/date'

const INITIAL_STATE = {
   data: [],
   metadata: null,
   filter: null,
   loading: true,
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
         const formatNas = action.payload.data.map(p => {
            if (!p.latest_nas) {
               return p
            }

            const n = new Date()
            const dt = getDateInCurrentTimeZone(p.latest_nas.nas_date)

            if (n.toLocaleDateString() === dt.toLocaleDateString()) {
               p.daily_nas = true
               return p
            }
            return p
         })
         return {
            data: rankingPatientsNas(formatNas),
            metadata: action.payload.metadata || state.metadata,
            loading: false,
            error: false,
            filter: action.payload.filter || state.filter
         }
      case 'FAILURE_PATIENT':
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
