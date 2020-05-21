import { red, orange, cyan } from '@material-ui/core/colors'

export const calcClassification = nas => {
   let average = 0

   if (nas.monitoring_and_controls === '1a') {
      average += 4.5
   } else if (nas.monitoring_and_controls === '1b') {
      average += 12.1
   } else if (nas.monitoring_and_controls === '1c') {
      average += 19.6
   }

   if (nas.laboratory_investigations) {
      average += 4.3
   }

   if (nas.medication_except_vasoactive_drugs) {
      average += 5.6
   }

   if (nas.hygiene_procedures === '4a') {
      average += 4.1
   } else if (nas.hygiene_procedures === '4b') {
      average += 16.5
   } else if (nas.hygiene_procedures === '4c') {
      average += 20
   }

   if (nas.caring_for_drains) {
      average += 1.8
   }

   if (nas.mobilization_and_positioning === '6a') {
      average += 5.5
   } else if (nas.mobilization_and_positioning === '6b') {
      average += 12.4
   } else if (nas.mobilization_and_positioning === '6c') {
      average += 17
   }

   if (nas.support_and_care === '7a') {
      average += 4
   } else if (nas.support_and_care === '7b') {
      average += 32
   }

   if (nas.administrative_and_managerial_tasks === '8a') {
      average += 4.2
   } else if (nas.administrative_and_managerial_tasks === '8b') {
      average += 23.2
   } else if (nas.administrative_and_managerial_tasks === '8c') {
      average += 30
   }

   if (nas.ventilatory_support) {
      average += 1.4
   }

   if (nas.artificial_airways) {
      average += 1.8
   }

   if (nas.lung_function) {
      average += 4.4
   }

   if (nas.vasoactive_drugs) {
      average += 1.2
   }

   if (nas.intravenous_replacement) {
      average += 2.5
   }

   if (nas.monitoring_of_the_left_atrium) {
      average += 1.7
   }

   if (nas.cardiorespiratory_resumption) {
      average += 7.1
   }

   if (nas.hemofiltration_techniques) {
      average += 7.7
   }

   if (nas.urine_output) {
      average += 7
   }

   if (nas.intracranial_pressure) {
      average += 1.6
   }

   if (nas.acidosis_treatment) {
      average += 1.3
   }

   if (nas.intravenous_hyperalimentation) {
      average += 2.8
   }

   if (nas.enteral_feeding) {
      average += 1.3
   }

   if (nas.specific_interventions_in_the_unit) {
      average += 2.8
   }

   if (nas.specific_interventions_outside_the_unit) {
      average += 1.9
   }
   return average
}

export const rankingPatientsNas = patients => {
   const patientsWithAverage = patients.map(patient => {
      if (patient.latest_nas) {
         return { ...patient, average: calcClassification(patient.latest_nas) }
      }
      return { ...patient, average: 0 }
   })

   patientsWithAverage.sort(function (a, b) {
      return a.average > b.average ? -1 : a.average < b.average ? 1 : 0
   })

   if (patientsWithAverage[0].average) {
      patientsWithAverage[0].color = red[500]
   }
   if (patientsWithAverage[1].average) {
      patientsWithAverage[1].color = orange[600]
   }
   if (patientsWithAverage[2].average) {
      patientsWithAverage[2].color = cyan[500]
   }

   return patientsWithAverage.sort(function (a, b) {
      if (!a.bed) {
         return 0
      }
      return a.bed < b.bed ? -1 : a.bed > b.bed ? 1 : 0
   })
}

export const dailyAveragePatientsNas = patients => {
   let sum = 0,
      count = 0
   patients.map(patient => {
      if (patient.latest_nas) {
         count++
         sum += patient.average
      }
      return patient
   })
   return sum / count
}
