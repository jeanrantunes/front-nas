import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Layout from '../../Layouts/dashboard'
import MaterialTableAPI from '../../containers/CustomMT'

const useStyles = makeStyles(theme => ({
   spacer: {
      marginTop: theme.spacing(5)
   }
}))

const CMS = () => {
   const classes = useStyles()
   return (
      <Layout>
         <MaterialTableAPI
            title='Comorbidades'
            columnTitle='Comorbidade'
            urlGet='v1/comorbidities'
            urlPost='v1/comorbidity'
            urlPut='v1/comorbidity'
            urlDelete='v1/comorbidity'
         />

         <MaterialTableAPI
            title='Motivos de internação'
            columnTitle='Motivos'
            urlGet='v1/hospitalization-reason'
            urlPost='v1/hospitalization-reason'
            urlPut='v1/hospitalization-reason'
            urlDelete='v1/hospitalization-reason'
            className={classes.spacer}
         />
      </Layout>
   )
}

export default CMS
