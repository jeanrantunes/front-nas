import React, { useState, useEffect } from 'react'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import {
   Button,
   Grid,
   TextField as TextFieldMeterial,
   FormControl,
   Snackbar,
   useMediaQuery
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { green, red } from '@material-ui/core/colors'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'

import { TextField } from 'formik-material-ui'
import { TimePicker, DatePicker } from 'formik-material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import Layout from '../../Layouts/dashboard'
import NasDialog from '../../containers/DialogLateNas'
import api from '../../services/api'
import { nameValidation, saps3Validation } from '../../utils/validations'
import { combineDateAndTime } from '../../helpers/date'
import CustomSelect from '../../containers/CustomSelect'
import ButtonLoading from '../../components/ButtonLoading'
import pt from 'date-fns/locale/pt-BR'

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
      '& .MuiButtonBase-root': {
         marginRight: theme.spacing(1)
      },
      [theme.breakpoints.down('sm')]: {
         '& .MuiButtonBase-root': {
            marginBottom: theme.spacing(1),
            minWidth: 120,
            marginRight: 0
         }
      }
   },
   wrapperLoading: {
      position: 'relative',
      float: 'right',
      marginRight: 0
   },

   success: {
      backgroundColor: green[500],
      color: theme.white
   },
   error: {
      backgroundColor: red[500],
      color: theme.white
   }
}))

const PatientSchema = Yup.object().shape({
   name: Yup.string()
      .min(4, nameValidation.tooShort)
      .max(40, nameValidation.tooLong)
      .required(nameValidation.required),
   saps3Validation: Yup.number()
      .min(0, saps3Validation.tooShort)
      .max(9999, saps3Validation.tooLong)
})

const Patient = props => {
   const classes = useStyles()
   const theme = useTheme()
   const isMobile = useMediaQuery(theme.breakpoints.down('md'))

   const { history } = props
   const { id } = props.match.params
   const [patient, setPatient] = useState(null)
   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)
   const timeSnack = 2000

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
                  hospitalization_date:
                     patient.hospitalization_date || new Date(),
                  hospitalization_time:
                     patient.hospitalization_date || new Date(),
                  hospitalization_reason:
                     (patient.hospitalization_reason &&
                        patient.hospitalization_reason.map(h => h.id)) ||
                     [],
                  comorbidities:
                     (patient.comorbidities &&
                        patient.comorbidities.map(c => c.id)) ||
                     [],
                  saps_3: patient.saps_3 || 0,
                  outcome: patient.outcome,
                  origin: patient.origin || 'ps',
                  outcome_time: patient.outcome_date || new Date(),
                  outcome_date: patient.outcome_date || new Date(),
                  bed: patient.bed || 'A'
               }}
               validationSchema={PatientSchema}
               onSubmit={async (values, { setSubmitting }) => {
                  setLoading(true)
                  setSuccess(false)
                  try {
                     const {
                        hospitalization_date,
                        hospitalization_time,
                        outcome_time,
                        outcome_date,
                        outcome,
                        ...rest
                     } = values
                     const data = {
                        ...rest,
                        outcome: outcome || 'pending',
                        hospitalization_date: combineDateAndTime(
                           hospitalization_date,
                           hospitalization_time
                        ),
                        outcome_date: combineDateAndTime(
                           outcome_date,
                           outcome_time
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
                        <MuiPickersUtilsProvider
                           utils={DateFnsUtils}
                           locale={pt}
                        >
                           <Grid container spacing={2}>
                              <Grid item xs={12} sm={4}>
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
                              <Grid item xs={12} sm={4}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={DatePicker}
                                       inputVariant='outlined'
                                       name='birthday'
                                       label='Data de nascimento'
                                       format='dd/MM/yyyy'
                                       maxDate={new Date()}
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={4}>
                                 <CustomSelect
                                    options={[
                                       {
                                          id: 'ps',
                                          name: 'Pronto Socorro (PS)'
                                       },
                                       { id: 'nursery', name: 'Enfermaria' },
                                       {
                                          id: 'surgical-ward',
                                          name: 'Bloco Cirúrgico'
                                       },
                                       {
                                          id: 'other-institution',
                                          name: 'Outra instituição'
                                       },
                                       { id: 'uti-covid', name: 'UTI Covid' },
                                       { id: 'home', name: 'Casa' }
                                    ]}
                                    label='Procedência'
                                    name='origin'
                                    variant='outlined'
                                    id='origin'
                                    value={values.origin}
                                 />
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={DatePicker}
                                       inputVariant='outlined'
                                       name='hospitalization_date'
                                       label='Data da internação'
                                       format='dd/MM/yyyy'
                                       maxDate={new Date()}
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={TimePicker}
                                       inputVariant='outlined'
                                       name='hospitalization_time'
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
                                    value={values.bed}
                                 />
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                 <FormControl fullWidth>
                                    <TextFieldMeterial
                                       id='saps_3'
                                       label='SAPS 3'
                                       type='number'
                                       name='saps_3'
                                       value={values.saps_3}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       helperText={
                                          errors.saps_3 && touched.saps_3
                                             ? errors.saps_3
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
                                    value={values.comorbidities}
                                 />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                 <CustomSelect
                                    endpoint='/v1/hospitalization-reason'
                                    label='Motivos da internação'
                                    name='hospitalization_reason'
                                    variant='outlined'
                                    id='hospitalization_reason'
                                    multiple
                                    value={values.hospitalization_reason}
                                 />
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                 <CustomSelect
                                    options={[
                                       { id: 'pending', name: 'Internado' },
                                       { id: 'discharge', name: 'Alta' },
                                       { id: 'death', name: 'Óbito' }
                                    ]}
                                    label='Desfecho'
                                    name='outcome'
                                    variant='outlined'
                                    id='outcome'
                                    value={values.outcome}
                                 />
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={DatePicker}
                                       inputVariant='outlined'
                                       name='outcome_date'
                                       label='Data do desfecho'
                                       disabled={
                                          !values.outcome ||
                                          values.outcome === 'pending'
                                       }
                                       format='dd/MM/yyyy'
                                       maxDate={new Date()}
                                    />
                                 </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                 <FormControl variant='outlined' fullWidth>
                                    <Field
                                       component={TimePicker}
                                       inputVariant='outlined'
                                       name='outcome_time'
                                       label='Hora do desfecho'
                                       disabled={
                                          !values.outcome ||
                                          values.outcome === 'pending'
                                       }
                                    />
                                 </FormControl>
                              </Grid>
                           </Grid>
                        </MuiPickersUtilsProvider>

                        <Grid container spacing={2} className={classes.wrapper}>
                           <Grid item xs={6} sm={6}>
                              {id && (
                                 <React.Fragment>
                                    <Button
                                       variant='contained'
                                       color='primary'
                                       type='button'
                                       component={Link}
                                       to={`/nas?patient_id=${id}`}
                                    >
                                       Histórico
                                    </Button>
                                    <NasDialog
                                       title='Selecione a data do nas'
                                       variant='contained'
                                       textButton={
                                          isMobile
                                             ? 'Cad. NAS'
                                             : 'Cadastrar NAS'
                                       }
                                       textButtonAction='Cadastrar'
                                       patient_id={id}
                                       history={history}
                                    />
                                 </React.Fragment>
                              )}
                           </Grid>

                           <Grid item xs={6} sm={6}>
                              <ButtonLoading
                                 variant='contained'
                                 color='primary'
                                 type='submit'
                                 loading={loading}
                                 success={success}
                                 wrapperClass={classes.wrapperLoading}
                                 className={classes.buttonSubmit}
                              >
                                 Salvar
                              </ButtonLoading>
                           </Grid>
                        </Grid>
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
