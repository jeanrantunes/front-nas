import React from 'react'
import { Provider } from 'react-redux'
import Routes from './routes'
import store from './store'
import Loader from './components/Loader'

const App = () => {
   return (
      <Provider store={store}>
         <React.Suspense fallback={<Loader />}>
            <Routes />
         </React.Suspense>
      </Provider>
   )
}

export default App
