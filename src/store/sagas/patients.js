import { put, call, select } from 'redux-saga/effects'

import api from '../../services/api'

export function* getPatientList({ payload: { filter } }) {
   try {
      const {
         data: { data, metadata }
      } = yield call(api.get, 'v1/patients', { params: filter })

      yield put({
         type: 'SUCCESS_PATIENT',
         filter,
         payload: { data, metadata }
      })
   } catch (err) {
      yield put({ type: 'FAILURE_PATIENT' })
   }
}

export function* addPatient({ payload: { data: content } }) {
   try {
      const currentData = yield select(state => state.patients.data)
      const { data } = yield call(api.post, 'v1/patients', content)

      yield put({
         type: 'SUCCESS_PATIENT',
         payload: { data: [...currentData, data] }
      })
   } catch (err) {
      yield put({ type: 'FAILURE_PATIENT' })
   }
}

export function* updatePatient({ payload: { data: content } }) {
   const { id, ...rest } = content
   delete rest.to_search
   delete rest.daily_nas
   try {
      const currentData = yield select(state => state.patients.data)
      const { data } = yield call(api.put, `v1/patients/${id}`, rest)
      const r = currentData.filter(patient => patient.id !== id)

      yield put({ type: 'SUCCESS_PATIENT', payload: { data: [...r, data] } })
   } catch (err) {
      yield put({ type: 'FAILURE_PATIENT' })
   }
}

export function* removePatient({ payload: { data: content } }) {
   const { id } = content
   try {
      const currentData = yield select(state => state.patients.data)
      yield call(api.delete, `v1/patients/${id}`)
      const r = currentData.filter(patient => patient.id !== id)

      yield put({ type: 'SUCCESS_PATIENT', payload: { data: r } })
   } catch (err) {
      yield put({ type: 'FAILURE_PATIENT' })
   }
}
