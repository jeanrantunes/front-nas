import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { green, red } from '@material-ui/core/colors'

import api from '../../services/api'
import {
   nameValidation,
   emailValidation,
   roleValidation
} from '../../utils/validations'
import Layout from '../../Layouts/dashboard'
import CustomSelect from '../../containers/CustomSelect'
import ButtonLoading from '../../components/ButtonLoading'

import { useUser } from '../../context/user'

const useStyles = makeStyles(theme => ({
   input: {
      margin: 0,
      marginBottom: theme.spacing(1)
   },
   wrapper: {
      float: 'right',
      margin: theme.spacing(3, 0, 2)
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

const LoginSchema = Yup.object().shape({
   name: Yup.string()
      .min(4, nameValidation.tooShort)
      .max(40, nameValidation.tooLong)
      .required(nameValidation.required),
   email: Yup.string()
      .email(emailValidation.invalid)
      .required(emailValidation.required),
   role: Yup.string().required(roleValidation.required)
})

const Invite = () => {
   const classes = useStyles()
   const { user } = useUser()

   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)

   const timeSnack = 2000

   return (
      <Layout>
         <Formik
            initialValues={{ name: '', email: '', role: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
               setLoading(true)
               setSuccess(false)
               setError(false)

               try {
                  await api.post('v1/users/signup', {
                     inviting: user.name,
                     ...values
                  })
                  setLoading(false)
                  setError(false)
                  setSuccess(true)
                  setTimeout(() => {
                     setSuccess(false)
                  }, timeSnack)
               } catch (err) {
                  setLoading(false)
                  setSuccess(false)
                  setError(true)
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
                     //  className={classes.form}
                     onSubmit={e => {
                        e.preventDefault()
                        handleSubmit()
                     }}
                     noValidate
                  >
                     <TextField
                        className={classes.input}
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='name'
                        label='Nome'
                        name='name'
                        autoComplete='name'
                        error={errors.name && touched.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        helperText={
                           errors.name && touched.name ? errors.name : ' '
                        }
                     />

                     <TextField
                        className={classes.input}
                        variant='outlined'
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='E-mail'
                        name='email'
                        autoComplete='email'
                        error={errors.email && touched.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        helperText={
                           errors.email && touched.email ? errors.email : ' '
                        }
                     />
                     <CustomSelect
                        className={classes.input}
                        options={[
                           //    { id: '', name: 'Nenhum' },
                           { id: 'USER', name: 'Usuário' },
                           { id: 'ADMIN', name: 'Administrador' }
                        ]}
                        required
                        label='Permissão'
                        name='role'
                        variant='outlined'
                        id='role'
                        error={errors.role && touched.role}
                        helperText={
                           errors.role && touched.role ? errors.role : ' '
                        }
                     />

                     <ButtonLoading
                        variant='contained'
                        color='primary'
                        type='submit'
                        loading={loading}
                        success={success}
                        wrapperClass={classes.wrapper}
                     >
                        Enviar
                     </ButtonLoading>
                  </form>
               )
            }}
         </Formik>
         <Snackbar open={success}>
            <Alert variant='filled' severity='success'>
               Convite enviado com sucesso :D
            </Alert>
         </Snackbar>
         <Snackbar open={error}>
            <Alert variant='filled' severity='error'>
               Erro. Usuário já existe
            </Alert>
         </Snackbar>
      </Layout>
   )
}

export default Invite
