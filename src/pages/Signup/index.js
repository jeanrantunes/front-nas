import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Avatar, Button, CssBaseline, Grid, TextField, Link, Container, Typography } from '@material-ui/core'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import { useAuth } from '../../context/auth'
import { nameValidation, emailValidation, passwordValidation } from '../../utils/validations'

const useStyles = makeStyles(theme => ({
   paper: {
      marginTop: theme.spacing(8),
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
      marginTop: theme.spacing(3),
   },
   submit: {
      margin: theme.spacing(3, 0, 2),
   },
}))

const SignupSchema = Yup.object().shape({
   name: Yup.string()
      .min(4, nameValidation.tooShort)
      .max(20, nameValidation.tooLong)
      .required(nameValidation.required),
   lastname: Yup.string()
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
   passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Senhas não combinam'),
})

const Signup = () => {
   const { signup, login } = useAuth()
   const classes = useStyles()

   return (
      <Container component='main' maxWidth='xs'>
         <CssBaseline />
         <div className={classes.paper}>
            <Avatar className={classes.avatar}>
               <LockOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
               Cadastrar
            </Typography>
            <Formik
               initialValues={{ name: '', lastname: '', email: '', password: '', passwordConfirmation: '' }}
               validationSchema={SignupSchema}
               onSubmit={async (values, { setSubmitting }) => {
                  const { name, lastname, passwordConfirmation, ...rest } = values
                  const response = await signup({ name: `${name} ${lastname}`, role: 'USER', ...rest })
                  const { email, password } = rest
                  await login({ email, password })
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
                        <Grid container spacing={2}>
                           <Grid item xs={12} sm={6}>
                              <TextField
                                 autoComplete='name'
                                 name='name'
                                 variant='outlined'
                                 required
                                 fullWidth
                                 id='name'
                                 label='Nome'
                                 autoFocus
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 value={values.name}
                                 helperText={errors.name && touched.name ? errors.name : ' '}
                              />
                           </Grid>
                           <Grid item xs={12} sm={6}>
                              <TextField
                                 variant='outlined'
                                 required
                                 fullWidth
                                 id='lastname'
                                 label='Sobrenome'
                                 name='lastname'
                                 autoComplete='lname'
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 value={values.lastname}
                                 helperText={errors.lastname && touched.lastname ? errors.lastname : ' '}
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
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 value={values.email}
                                 helperText={errors.email && touched.email ? errors.email : ' '}
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
                                 autoComplete='current-password'
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 value={values.password}
                                 helperText={errors.password && touched.password ? errors.password : ' '}
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
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 value={values.passwordConfirmation}
                                 helperText={
                                    errors.passwordConfirmation && touched.passwordConfirmation
                                       ? errors.passwordConfirmation
                                       : ' '
                                 }
                              />
                           </Grid>
                        </Grid>
                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                           Cadastrar-se
                        </Button>
                        <Grid container justify='flex-end'>
                           <Grid item>
                              <Link href='#' variant='body2'>
                                 Já tem uma conta? Clique aqui
                              </Link>
                           </Grid>
                        </Grid>
                     </form>
                  )
               }}
            </Formik>
         </div>
      </Container>
   )
}

export default Signup
