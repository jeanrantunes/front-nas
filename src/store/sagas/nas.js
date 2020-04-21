import { put, call, select } from 'redux-saga/effects'

import api from '../../services/api'

export function* getNasList({ payload: { filter } }) {
   try {
      const {
         data: { data: data, metadata }
      } = yield call(api.get, 'v1/nas', { params: filter })
      console.log(data)
      yield put({ type: 'SUCCESS_NAS', payload: { data, metadata } })
   } catch (err) {
      yield put({ type: 'FAILURE_NAS' })
   }
}

// export function* addPatient({ payload: { data: content } }) {
//    try {
//       const currentData = yield select(state => state.patients.data)
//       const { data } = yield call(api.post, 'v1/patients', content)

//       yield put({
//          type: 'SUCCESS_PATIENT',
//          payload: { data: [...currentData, data] }
//       })
//    } catch (err) {
//       console.log(err)
//       yield put({ type: 'FAILURE_PATIENT' })
//    }
// }

// export function* updatePatient({ payload: { data: content } }) {
//    const { id, ...rest } = content

//    try {
//       const currentData = yield select(state => state.patients.data)
//       const { data } = yield call(api.put, `v1/patients/${id}`, rest)
//       const r = currentData.filter(patient => patient.id !== id)

//       yield put({ type: 'SUCCESS_PATIENT', payload: { data: [...r, data] } })
//    } catch (err) {
//       console.log(err)
//       yield put({ type: 'FAILURE_PATIENT' })
//    }
// }

export function* removeNas({ payload: { data: content } }) {
   const { id } = content
   try {
      const currentData = yield select(state => state.nas.data)
      yield call(api.delete, `v1/nas/${id}`)
      const r = currentData.filter(nas => nas.id !== id)

      yield put({ type: 'SUCCESS_NAS', payload: { data: r } })
   } catch (err) {
      console.log(err)
      yield put({ type: 'FAILURE_NAS' })
   }
}
