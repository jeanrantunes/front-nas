import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import {
   Button,
   Grid,
   TextField as TextFieldMeterial,
   FormControl,
   Snackbar,
   CircularProgress
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { green, white, red } from '@material-ui/core/colors'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import { TextField } from 'formik-material-ui'
import { TimePicker, DatePicker } from 'formik-material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'
import { makeStyles } from '@material-ui/core/styles'

import Layout from '../../Layouts/dashboard'
import Loader from '../../components/Loader'
import api from '../../services/api'
import { nameValidation, saps3 } from '../../utils/validations'
import { combineDateAndTime } from '../../helpers/date'
import CustomSelect from '../../containers/CustomSelect'

const useStyles = makeStyles(theme => ({
   paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3)
   },
   formControl: {
      marginBottom: theme.spacing(3)
   },
   submit: {
      margin: theme.spacing(3, 0, 2)
   },
   chips: {
      display: 'flex',
      flexWrap: 'wrap'
   },
   chip: {
      margin: 2
   },
   noLabel: {
      marginTop: theme.spacing(3)
   },
   wrapper: {
      marginTop: theme.spacing(3),
      float: 'right',
      position: 'relative'
   },
   buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
   },
   success: {
      backgroundColor: green[500],
      color: theme.white
   },
   error: {
      backgroundColor: red[500],
      color: theme.white
   },
   buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
         backgroundColor: green[700]
      }
   }
}))

const PatientSchema = Yup.object().shape({
   name: Yup.string()
      .min(4, nameValidation.tooShort)
      .max(40, nameValidation.tooLong)
      .required(nameValidation.required),
   saps3: Yup.number().min(0, saps3.tooShort).max(9999, saps3.tooLong)
})

const Patient = props => {
   const classes = useStyles()

   const { id } = props.match.params

   const [patient, setPatient] = useState(null)
   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)
   const timeSnack = 2000

   const buttonClassname = clsx({
      [classes.buttonSuccess]: success
   })
   useEffect(() => {
      if (!id) {
         setPatient({})
         return
      }
      async function getPatient() {
         try {
            const { data } = await api.get(`v1/patients/${id}`)
            setPatient(data)
         } catch (error) {
            console.log(error)
            setPatient(null)
         }
      }
      getPatient()
   }, [id])
   return (
      <Layout>
         {patient && (
            <Formik
               initialValues={{
                  name: patient.name || '',
                  birthday: patient.birthday || new Date('1970'),
                  hospitalizationDate:
                     patient.hospitalizationDate || new Date(),
                  hospitalizationTime:
                     patient.hospitalizationDate || new Date(),
                  hospitalizationReason: patient.hospitalizationReason || [],
                  comorbidities: patient.comorbidities || [],
                  saps3: patient.saps3 || 0,
                  outcome: patient.outcome === 'pending' ? '' : patient.outcome,
                  outcomeTime: patient.outcomeDate || new Date(),
                  outcomeDate: patient.outcomeDate || new Date(),
                  bed: patient.bed || 'A'
               }}
               validationSchema={PatientSchema}
               onSubmit={async (values, { setSubmitting }) => {
                  setLoading(true)
                  setSuccess(false)
                  try {
                     const {
                        hospitalizationDate,
                        hospitalizationTime,
                        outcomeTime,
                        outcomeDate,
                        outcome,
                        ...rest
                     } = values
                     const data = {
                        ...rest,
                        outcome: outcome || 'pending',
                        hospitalizationDate: combineDateAndTime(
                           hospitalizationDate,
                           hospitalizationTime
                        ),
                        outcomeDate: combineDateAndTime(
                           outcomeDate,
                           outcomeTime
                        )
                     }
                     if (!id) {
                        await api.post('v1/patients', data)
                     } else {
                        await api.put(`v1/patients/${id}`, data)
                     }

                     setLoading(false)
                     setSuccess(true)
                     setError(false)

                     setTimeout(() => {
                        props.history.goBack()
                        setSuccess(false)
                     }, timeSnack)
                  } catch (err) {
                     setLoading(false)
                     setSuccess(false)
                     setError(false)
                     setTimeout(() => {
                        setError(false)
                     }, timeSnack)
                  }
               }}
            >
               {props => {
                  const {
                     values,
                     touched,
                     errors,
                     handleChange,
                     handleBlur,
                     handleSubmit
                  } = props
                  return (
                     <form
                        className={classes.form}
                        onSubmit={e => {
                           e.preventDefault()
                           handleSubmit()
                        }}
                        noValidate
                     >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                           <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                 <FormControl fullWidth>
                                    <Field
                                       component={TextField}
                                       variant='outlined'
                                       type='text'
                                       label='Nome'
                                       name='name'
                                       id='name'
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={DatePicker}
                                       inputVariant='outlined'
                                       name='birthday'
                                       label='Data de nascimento'
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={DatePicker}
                                       inputVariant='outlined'
                                       name='hospitalizationDate'
                                       label='Data da internação'
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={TimePicker}
                                       inputVariant='outlined'
                                       name='hospitalizationTime'
                                       label='Hora da internação'
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                 <CustomSelect
                                    options={[
                                       { id: 'A', name: 'A' },
                                       { id: 'B', name: 'B' },
                                       { id: 'C', name: 'C' },
                                       { id: 'D', name: 'D' },
                                       { id: 'E', name: 'E' },
                                       { id: 'F', name: 'F' }
                                    ]}
                                    label='Leito'
                                    name='bed'
                                    variant='outlined'
                                    id='bed'
                                 />
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                 <FormControl fullWidth>
                                    <TextFieldMeterial
                                       id='saps3'
                                       label='SAPS 3'
                                       type='number'
                                       name='saps3'
                                       value={values.saps3}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       helperText={
                                          errors.saps3 && touched.saps3
                                             ? errors.saps3
                                             : ' '
                                       }
                                       variant='outlined'
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                 <CustomSelect
                                    endpoint='/v1/comorbidities'
                                    label='Comormidades'
                                    name='comorbidities'
                                    variant='outlined'
                                    id='comorbidities'
                                    multiple
                                 />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                 <CustomSelect
                                    endpoint='/v1/hospitalization-reason'
                                    label='Motivos da internação'
                                    name='hospitalizationReason'
                                    variant='outlined'
                                    id='hospitalizationReason'
                                    multiple
                                 />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                 <CustomSelect
                                    options={[
                                       { id: '', name: 'Nenhum' },
                                       { id: 'discharge', name: 'Alta' },
                                       { id: 'death', name: 'Morte' }
                                    ]}
                                    label='Desfecho'
                                    name='outcome'
                                    variant='outlined'
                                    id='outcome'
                                 />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={DatePicker}
                                       inputVariant='outlined'
                                       name='outcomeDate'
                                       label='Data do desfecho'
                                       disabled={!values.outcome}
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={TimePicker}
                                       inputVariant='outlined'
                                       name='outcomeTime'
                                       label='Hora do desfecho'
                                       disabled={!values.outcome}
                                    />
                                 </FormControl>
                              </Grid>
                           </Grid>
                        </MuiPickersUtilsProvider>
                        <div className={classes.wrapper}>
                           <Button
                              variant='contained'
                              color='primary'
                              type='submit'
                              className={buttonClassname}
                              disabled={loading}
                           >
                              Salvar
                           </Button>
                           {loading && (
                              <CircularProgress
                                 size={24}
                                 className={classes.buttonProgress}
                              />
                           )}
                        </div>
                        <Snackbar open={success}>
                           <Alert variant='filled' severity='success'>
                              Salvo com sucesso :D
                           </Alert>
                        </Snackbar>
                        <Snackbar open={error}>
                           <Alert variant='filled' severity='error'>
                              Algo deu errado :(
                           </Alert>
                        </Snackbar>
                     </form>
                  )
               }}
            </Formik>
         )}
      </Layout>
   )
}

export default Patient
