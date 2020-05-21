import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
   Avatar,
   Button,
   CssBaseline,
   Grid,
   TextField,
   Paper,
   Typography,
   Snackbar
} from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Alert } from '@material-ui/lab'

import api from '../../services/api'
import { useAuth } from '../../context/auth'
import { emailValidation, passwordValidation } from '../../utils/validations'
import ButtonLoading from '../../components/ButtonLoading'

const useStyles = makeStyles(theme => ({
   root: {
      height: '100vh'
   },
   image: {
      backgroundImage: 'url(https://source.unsplash.com/1600x900/?nurse )',
      backgroundRepeat: 'no-repeat',
      backgroundColor: theme.palette.grey[50],
      backgroundSize: 'cover',
      backgroundPosition: 'center'
   },
   paper: {
      margin: theme.spacing(8, 4),
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
      marginTop: theme.spacing(1)
   },
   submit: {
      marginBottom: theme.spacing(2)
   },
   input: {
      marginTop: 0,
      marginBottom: theme.spacing(1)
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

   wrapperLoading: {
      position: 'relative',
      float: 'right',
      marginRight: 0
   }
}))

const Login = () => {
   const { login } = useAuth()
   const classes = useStyles()
   const [isRecoverPassword, setIsRecoverPassword] = useState(false)
   const [loading, setLoading] = useState(false)
   const [msg, setMsg] = useState(null)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)
   const timeSnack = 4000

   const LoginSchema = Yup.object().shape({
      email: Yup.string()
         .email(emailValidation.invalid)
         .required(emailValidation.required),
      password: Yup.lazy(value => {
         if (isRecoverPassword) {
            return Yup.mixed().notRequired()
         }
         return Yup.string()
            .min(4, passwordValidation.tooShort)
            .max(20, passwordValidation.tooLong)
            .required(passwordValidation.required)
      })
   })

   return (
      <Grid container component='main' className={classes.root}>
         <CssBaseline />
         <Grid item xs={false} sm={4} md={8} className={classes.image} />
         <Grid
            item
            xs={12}
            sm={8}
            md={4}
            component={Paper}
            elevation={6}
            square
         >
            <div className={classes.paper}>
               <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
               </Avatar>
               <Typography component='h1' variant='h5'>
                  {isRecoverPassword ? 'Recuperar' : 'Entrar'}
               </Typography>
               <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                     setLoading(true)
                     setSuccess(false)
                     setError(false)
                     const { email } = values
                     if (isRecoverPassword) {
                        try {
                           const { data } = await api.post(
                              'v1/users/password',
                              {
                                 email
                              }
                           )
                           const { success } = data
                           if (success) {
                              setMsg(
                                 'Enviamos um e-mail com as instruções para recuperação da senha'
                              )
                              setLoading(false)
                              setError(false)
                              setSuccess(true)
                              setTimeout(() => {
                                 setSuccess(false)
                              }, timeSnack)
                              return
                           }
                           setMsg(null)
                           setLoading(false)
                           setSuccess(false)
                           setError(true)
                           setTimeout(() => {
                              setError(false)
                           }, timeSnack)
                        } catch (err) {
                           setMsg(null)
                           setLoading(false)
                           setSuccess(false)
                           setError(true)
                           setTimeout(() => {
                              setError(false)
                           }, timeSnack)
                        }
                        return
                     }
                     try {
                        await login(values)
                     } catch (err) {
                        setMsg(null)

                        if (err.response && err.response.status === 401) {
                           setMsg('Usuário ou senha incorretos')
                        }
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
                              autoFocus
                              error={errors.email && touched.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              disabled={loading}
                              helperText={
                                 errors.email && touched.email
                                    ? errors.email
                                    : ' '
                              }
                           />
                           {!isRecoverPassword && (
                              <TextField
                                 className={classes.input}
                                 variant='outlined'
                                 margin='normal'
                                 required
                                 fullWidth
                                 name='password'
                                 label='Senha'
                                 type='password'
                                 id='password'
                                 disabled={loading}
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
                           )}

                           <ButtonLoading
                              variant='contained'
                              color='primary'
                              type='submit'
                              disabled={loading}
                              loading={loading}
                              success={success}
                              wrapperClass={classes.wrapperLoading}
                           >
                              {isRecoverPassword ? 'Recuperar' : 'Entrar'}
                           </ButtonLoading>

                           {!isRecoverPassword ? (
                              <Button
                                 onClick={() => setIsRecoverPassword(true)}
                                 variant='body2'
                              >
                                 Esqueceu sua senha?
                              </Button>
                           ) : (
                              <Button
                                 onClick={() => setIsRecoverPassword(false)}
                                 variant='body2'
                              >
                                 Fazer login
                              </Button>
                           )}
                        </form>
                     )
                  }}
               </Formik>
               <Snackbar
                  open={success}
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'right'
                  }}
               >
                  <Alert variant='filled' severity='success'>
                     {msg || 'Sucesso'}
                  </Alert>
               </Snackbar>
               <Snackbar
                  open={error}
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'right'
                  }}
               >
                  <Alert variant='filled' severity='error'>
                     {msg || ' Ocorreu um problema. Tente novamente'}
                  </Alert>
               </Snackbar>
            </div>
         </Grid>
      </Grid>
   )
}

export default Login
