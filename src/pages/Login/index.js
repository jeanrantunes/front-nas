import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
   Avatar,
   Button,
   CssBaseline,
   Grid,
   TextField,
   FormControlLabel,
   Checkbox,
   Link,
   Paper,
   Typography,
} from '@material-ui/core'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import { useAuth } from '../../context/auth'
import { emailValidation, passwordValidation } from '../../utils/validations'

const useStyles = makeStyles(theme => ({
   root: {
      height: '100vh',
   },
   image: {
      backgroundImage: 'url(https://source.unsplash.com/1600x900/?nurse )',
      backgroundRepeat: 'no-repeat',
      backgroundColor: theme.palette.grey[50],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
   },
   paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },
   avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
   },
   submit: {
      margin: theme.spacing(3, 0, 2),
   },
}))

const LoginSchema = Yup.object().shape({
   email: Yup.string()
      .email(emailValidation.invalid)
      .required(emailValidation.required),
   password: Yup.string()
      .min(4, passwordValidation.tooShort)
      .max(20, passwordValidation.tooLong)
      .required(passwordValidation.required),
})

const Login = () => {
   const { login } = useAuth()
   const classes = useStyles()

   return (
      <Grid container component='main' className={classes.root}>
         <CssBaseline />
         <Grid item xs={false} sm={4} md={8} className={classes.image} />
         <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
            <div className={classes.paper}>
               <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
               </Avatar>
               <Typography component='h1' variant='h5'>
                  Entrar
               </Typography>
               <Formik
                  initialValues={{ email: '', password: '' }}
                  validationSchema={LoginSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                     // console.log(setSubmitting)
                     const response = await login(values)
                     // console.log(response)
                  }}
               >
                  {props => {
                     const {
                        values,
                        touched,
                        errors,
                        dirty,
                        isSubmitting,
                        submitForm,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        handleReset,
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
                              variant='outlined'
                              margin='normal'
                              required
                              fullWidth
                              id='email'
                              label='E-mail'
                              name='email'
                              autoComplete='email'
                              autoFocus
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              helperText={errors.email && touched.email ? errors.email : ' '}
                           />
                           <TextField
                              variant='outlined'
                              margin='normal'
                              required
                              fullWidth
                              name='password'
                              label='Senha'
                              type='password'
                              id='password'
                              autoComplete='current-password'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password}
                              helperText={errors.password && touched.password ? errors.password : ' '}
                           />
                           <FormControlLabel
                              control={<Checkbox value='remember' color='primary' />}
                              label='Salvar usuário'
                           />
                           <Button
                              type='submit'
                              fullWidth
                              variant='contained'
                              color='primary'
                              className={classes.submit}
                           >
                              Entrar
                           </Button>
                           <Grid container>
                              <Grid item xs>
                                 <Link href='#' variant='body2'>
                                    Esqueceu sua senha?
                                 </Link>
                              </Grid>
                              <Grid item>
                                 <Link href='#' variant='body2'>
                                    {'Não tem uma conta? Crie aqui'}
                                 </Link>
                              </Grid>
                           </Grid>
                        </form>
                     )
                  }}
               </Formik>
            </div>
         </Grid>
      </Grid>
   )
}

export default Login
