import { takeLatest, all } from 'redux-saga/effects'

import { getPatientList, getPatient, addPatient, updatePatient, removePatient } from './patients'

export default function* root() {
   yield all([
      takeLatest('REQUEST_PATIENT', getPatientList),
      takeLatest('ADD_PATIENT', addPatient),
      takeLatest('UPDATE_PATIENT', updatePatient),
      takeLatest('REMOVE_PATIENT', removePatient),
   ])
}
