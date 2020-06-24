import { put, call, select } from 'redux-saga/effects'

import api from '../../services/api'
import { calcClassification } from '../../utils/nas-func'
export function* getNasList({ payload: { filter } }) {
   try {
      const {
         data: { data: nas, metadata }
      } = yield call(api.get, 'v1/nas', { params: filter })

      if (!nas || !nas.length) {
         yield put({
            type: 'SUCCESS_NAS',
            payload: {
               data: [],
               metadata,
               filter
            }
         })
         return
      }

      const nasWithAverage = nas.map(n => ({
         ...n,
         average: calcClassification(n)
      }))

      yield put({
         type: 'SUCCESS_NAS',
         payload: {
            data: nasWithAverage,
            metadata,
            filter
         }
      })
   } catch (err) {
      yield put({ type: 'FAILURE_NAS', filter })
   }
}

export function* removeNas({ payload: { data: content } }) {
   const { id } = content
   try {
      const currentData = yield select(state => state.nas.data)
      yield call(api.delete, `v1/nas/${id}`)
      const r = currentData.filter(nas => nas.id !== id)

      yield put({ type: 'SUCCESS_NAS', payload: { data: r } })
   } catch (err) {
      yield put({ type: 'FAILURE_NAS' })
   }
}
