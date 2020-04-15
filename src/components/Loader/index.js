import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress, Backdrop } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
   backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff'
   }
}))

const Loader = () => {
   const classes = useStyles()
   return (
      <Backdrop open={true} className={classes.backdrop}>
         <CircularProgress color='secondary' />
      </Backdrop>
   )
}

export default Loader
