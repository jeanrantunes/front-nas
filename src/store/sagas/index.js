import { takeLatest, all } from 'redux-saga/effects'

import {
   getPatientList,
   addPatient,
   updatePatient,
   removePatient
} from './patients'

import { getNasList, removeNas } from './nas'

export default function* root() {
   yield all([
      takeLatest('REQUEST_PATIENT', getPatientList),
      takeLatest('ADD_PATIENT', addPatient),
      takeLatest('UPDATE_PATIENT', updatePatient),
      takeLatest('REMOVE_PATIENT', removePatient),
      takeLatest('REQUEST_NAS', getNasList),
      takeLatest('REMOVE_NAS', removeNas)
   ])
}
