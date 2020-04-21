import { combineReducers } from 'redux'

import patients from './patients'
import nas from './nas'

export default combineReducers({
   patients,
   nas
})
