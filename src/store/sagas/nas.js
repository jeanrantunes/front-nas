import { put, call, select } from 'redux-saga/effects'

import api from '../../services/api'

export function* getNasList({ payload: { filter } }) {
   try {
      const {
         data: { data: data, metadata }
      } = yield call(api.get, 'v1/nas', { params: filter })

      let nasWithAverage = []
      if (data) {
         nasWithAverage = data.map(nas => {
            let average = 0
            if (nas.monitoringAndControls === '1a') {
               average += 4.5
            } else if (nas.monitoringAndControls === '1b') {
               average += 12.1
            } else if (nas.monitoringAndControls === '1c') {
               average += 19.6
            }

            if (nas.laboratoryInvestigations) {
               average += 4.3
            }

            if (nas.medicationExceptVasoactiveDrugs) {
               average += 5.6
            }

            if (nas.hygieneProcedures === '4a') {
               average += 4.1
            } else if (nas.hygieneProcedures === '4b') {
               average += 16.5
            } else if (nas.hygieneProcedures === '4c') {
               average += 20
            }

            if (nas.caringForDrains) {
               average += 1.8
            }

            if (nas.mobilizationAndPositioning === '6a') {
               average += 5.5
            } else if (nas.mobilizationAndPositioning === '6b') {
               average += 12.4
            } else if (nas.mobilizationAndPositioning === '6c') {
               average += 17
            }

            if (nas.supportAndCare === '7a') {
               average += 4
            } else if (nas.supportAndCare === '7b') {
               average += 32
            }

            if (nas.administrativeAndManagerialTasks === '8a') {
               average += 4.2
            } else if (nas.administrativeAndManagerialTasks === '8b') {
               average += 23.2
            } else if (nas.administrativeAndManagerialTasks === '8c') {
               average += 30
            }

            if (nas.ventilatorySupport) {
               average += 1.4
            }

            if (nas.artificialAirways) {
               average += 1.8
            }

            if (nas.lungFunction) {
               average += 4.4
            }

            if (nas.vasoactiveDrugs) {
               average += 1.2
            }

            if (nas.intravenousReplacement) {
               average += 2.5
            }

            if (nas.monitoringOfTheLeftAtrium) {
               average += 1.7
            }

            if (nas.cardiorespiratoryResumption) {
               average += 7.1
            }

            if (nas.hemofiltrationTechniques) {
               average += 7.7
            }

            if (nas.urineOutput) {
               average += 7
            }

            if (nas.intracranialPressure) {
               average += 1.6
            }

            if (nas.acidosisTreatment) {
               average += 1.3
            }

            if (nas.intravenousHyperalimentation) {
               average += 2.8
            }

            if (nas.enteralFeeding) {
               average += 1.3
            }

            if (nas.specificInterventionsInTheUnit) {
               average += 2.8
            }

            if (nas.specificInterventionsOutsideTheUnit) {
               average += 1.9
            }
            return { ...nas, average }
         })
      }

      yield put({
         type: 'SUCCESS_NAS',
         payload: { data: nasWithAverage, metadata, filter }
      })
   } catch (err) {
      yield put({ type: 'FAILURE_NAS', filter })
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
