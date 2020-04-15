import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Beds from './pages/Beds'
import Patients from './pages/Patients'
import Patient from './pages/Patient'
import Nas from './pages/Nas'

import { useUser } from './context/user'

const PrivateRoute = ({ component: Component, ...rest }) => {
   const { user } = useUser()
   return (
      <Route
         {...rest}
         render={props =>
            user ? (
               <Component {...props} />
            ) : (
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
         <PrivateRoute exact path='/' component={Beds} />
         <PrivateRoute path='/patients' component={Patients} />
         <PrivateRoute path='/patient/:id' component={Patient} />
         <PrivateRoute path='/nas/:id' component={Nas} />
         <PrivateRoute exact path='/patient' component={Patient} />
         <Route path='/login' component={Login} />
         <Route path='/signup' component={Signup} />
      </Switch>
   </BrowserRouter>
)

export default Routes
