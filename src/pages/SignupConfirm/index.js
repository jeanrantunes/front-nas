import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
   Avatar,
   Button,
   CssBaseline,
   Grid,
   TextField,
   Container,
   Typography,
   Snackbar,
   CircularProgress
} from '@material-ui/core'
import { Link } from 'react-router-dom'

import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'
import { green, red } from '@material-ui/core/colors'

import { useAuth } from '../../context/auth'
import {
   nameValidation,
   emailValidation,
   passwordValidation
} from '../../utils/validations'
import { getQueryStringValue } from '../../helpers/queryString'
import api from '../../services/api'
const useStyles = makeStyles(theme => ({
   paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
   },
   avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3)
   },
   submit: {
      margin: theme.spacing(3, 0, 2)
   },
   wrapperLoading: {
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
   },
   errorMsg: {
      marginTop: theme.spacing(7)
   }
}))

const SignupSchema = Yup.object().shape({
   name: Yup.string()
      .min(4, nameValidation.tooShort)
      .max(20, nameValidation.tooLong)
      .required(nameValidation.required),
   email: Yup.string()
      .email(emailValidation.invalid)
      .required(emailValidation.required),
   password: Yup.string()
      .min(4, passwordValidation.tooShort)
      .max(20, passwordValidation.tooLong)
      .required(passwordValidation.required),
   passwordConfirmation: Yup.string()
      .min(4, passwordValidation.tooShort)
      .max(20, passwordValidation.tooLong)
      .required(passwordValidation.required)
      .oneOf([Yup.ref('password'), null], 'Senhas não combinam')
})

const SignupConfirm = () => {
   const { updateUser, login } = useAuth()
   const [user, setUser] = useState(null)
   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)
   const classes = useStyles()
   const token = getQueryStringValue('token')
   const passwordToken = getQueryStringValue('password_token')

   const timeSnack = 2000

   useEffect(() => {
      async function getUser() {
         try {
            const { data } = await api.get('v1/users/signup-confirm', {
               params: { token }
            })
            setUser({ ...data, firstTime: true })
         } catch {
            setUser(null)
         }
      }
      if (!passwordToken) {
         getUser()
      }
   }, [token, passwordToken])

   useEffect(() => {
      async function getUser() {
         try {
            const { data } = await api.get('v1/users/password', {
               params: { token: passwordToken }
            })
            setUser(data)
         } catch {
            setUser(null)
         }
      }
      if (!token) {
         getUser()
      }
   }, [passwordToken, token])

   return (
      <Container component='main' maxWidth='xs'>
         <CssBaseline />

         {user ? (
            <div className={classes.paper}>
               <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
               </Avatar>
               <Typography component='h1' variant='h5'>
                  Cadastro
               </Typography>
               <Formik
                  initialValues={{
                     name: user.name || '',
                     email: user.email || '',
                     password: '',
                     passwordConfirmation: ''
                  }}
                  validationSchema={SignupSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                     const { passwordConfirmation, ...rest } = values
                     const { id, token, role, firstTime } = user
                     setLoading(true)
                     setSuccess(false)
                     setError(false)
                     try {
                        const { user } = await updateUser({
                           id,
                           token,
                           role,
                           ...rest
                        })

                        const { email } = user

                        await login({
                           email,
                           password: rest.password,
                           firstTime
                        })
                        setLoading(false)
                        setError(false)
                        setSuccess(true)
                        setTimeout(() => {
                           setSuccess(false)
                        }, timeSnack)
                     } catch (err) {
                        console.log(err)
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
                           className={classes.form}
                           onSubmit={e => {
                              e.preventDefault()
                              handleSubmit()
                           }}
                           noValidate
                        >
                           <Grid container spacing={2}>
                              <Grid item xs={12}>
                                 <TextField
                                    autoComplete='name'
                                    name='name'
                                    variant='outlined'
                                    required
                                    fullWidth
                                    id='name'
                                    label='Nome'
                                    error={errors.name && touched.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    helperText={
                                       errors.name && touched.name
                                          ? errors.name
                                          : ' '
                                    }
                                 />
                              </Grid>

                              <Grid item xs={12}>
                                 <TextField
                                    variant='outlined'
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
                                       errors.email && touched.email
                                          ? errors.email
                                          : ' '
                                    }
                                 />
                              </Grid>
                              <Grid item xs={12}>
                                 <TextField
                                    variant='outlined'
                                    required
                                    fullWidth
                                    name='password'
                                    label='Senha'
                                    type='password'
                                    id='password'
                                    error={errors.password && touched.password}
                                    autoComplete='current-password'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    helperText={
                                       errors.password && touched.password
                                          ? errors.password
                                          : ' '
                                    }
                                 />
                              </Grid>
                              <Grid item xs={12}>
                                 <TextField
                                    variant='outlined'
                                    required
                                    fullWidth
                                    name='passwordConfirmation'
                                    label='Confirme sua senha'
                                    type='password'
                                    id='passwordConfirmation'
                                    autoComplete='current-password'
                                    error={
                                       errors.passwordConfirmation &&
                                       touched.passwordConfirmation
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.passwordConfirmation}
                                    helperText={
                                       errors.passwordConfirmation &&
                                       touched.passwordConfirmation
                                          ? errors.passwordConfirmation
                                          : ' '
                                    }
                                 />
                              </Grid>
                           </Grid>
                           <div className={classes.wrapperLoading}>
                              <Button
                                 type='submit'
                                 fullWidth
                                 variant='contained'
                                 color='primary'
                                 className={classes.submit}
                                 disabled={loading}
                              >
                                 Confirmar
                              </Button>
                              {loading && (
                                 <CircularProgress
                                    size={24}
                                    className={classes.buttonProgress}
                                 />
                              )}
                           </div>
                           <Grid container justify='flex-end'>
                              <Grid item>
                                 <Link to='/login' variant='body2'>
                                    Já tem uma conta? Clique aqui
                                 </Link>
                              </Grid>
                           </Grid>
                        </form>
                     )
                  }}
               </Formik>
            </div>
         ) : (
            <React.Fragment>
               <Typography
                  align='center'
                  variant='h5'
                  className={classes.errorMsg}
               >
                  {passwordToken
                     ? 'O tempo para a troca de senha expirou'
                     : 'Seu cadastro já foi confirmado ou seu convite não existe'}
               </Typography>
               <Typography align='center' variant='body2'>
                  <br />
                  {passwordToken ? (
                     <React.Fragment>
                        <Link to='/login' variant='body2'>
                           Clique aqui
                        </Link>{' '}
                        e solicite novamente a troca de senha.
                     </React.Fragment>
                  ) : (
                     'Atualize a página, caso o problema persista, entre em contato com o administrador do sistema.'
                  )}
                  <br />
                  <br />
                  Caso já possua acesso,{' '}
                  <Link to='/login' variant='body2'>
                     clique aqui
                  </Link>
               </Typography>
            </React.Fragment>
         )}
         <Snackbar open={success}>
            <Alert variant='filled' severity='success'>
               Cadastro confirmado
            </Alert>
         </Snackbar>
         <Snackbar open={error}>
            <Alert variant='filled' severity='error'>
               Ocorreu um problema. Tente novamente
            </Alert>
         </Snackbar>
      </Container>
   )
}

export default SignupConfirm
