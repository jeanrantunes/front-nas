import { combineReducers } from 'redux'

import patients from './patients'
import nas from './nas'
import steps from './stepByStep'

export default combineReducers({
   patients,
   nas,
   steps
})
