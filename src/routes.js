import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Beds from './pages/Beds'
import Patients from './pages/Patients'
import Patient from './pages/Patient'
import Nas from './pages/Nas'
import NasList from './pages/NasList'
import Cms from './pages/CMS'
import Invite from './pages/InviteUsers'
import SignupConfirm from './pages/SignupConfirm'
import { useUser } from './context/user'

const PrivateRoute = ({ component: Component, level, ...rest }) => {
   const { user } = useUser()
   return (
      <Route
         {...rest}
         render={props =>
            user ? (
               user.role === level || level === 'USER' ? (
                  <Component {...props} />
               ) : (
                  // <Redirect
                  //    to={{
                  //       pathname: '/login',
                  //       state: { from: props.location }
                  //    }}
                  // />
                  <h1>Sem permissão</h1>
               )
            ) : (
               // {level && <Component {...props} />}
               <Redirect
                  to={{ pathname: '/login', state: { from: props.location } }}
               />
            )
         }
      />
   )
}

const Routes = () => (
   <BrowserRouter>
      <Switch>
         <PrivateRoute exact path='/' component={Beds} level='USER' />
         <PrivateRoute path='/patients' component={Patients} level='USER' />
         <PrivateRoute path='/patient/:id' component={Patient} level='USER' />
         <PrivateRoute exact path='/nas' component={NasList} level='USER' />
         <PrivateRoute path='/nas/:id' component={Nas} level='USER' />
         <PrivateRoute exact path='/patient' component={Patient} level='USER' />
         <PrivateRoute path='/cms' component={Cms} level='ADMIN' />
         <PrivateRoute path='/invite-users' component={Invite} level='ADMIN' />
         <Route path='/login' component={Login} />
         <Route path='/signup-confirm' component={SignupConfirm} />
         <Route path='/signup' component={Signup} />
      </Switch>
   </BrowserRouter>
)

export default Routes
