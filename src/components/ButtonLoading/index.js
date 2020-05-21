import React from 'react'
import { Button, CircularProgress } from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
   wrapper: {
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
   buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
         backgroundColor: green[700]
      }
   }
}))

const ButtonLoading = ({
   loading,
   success,
   className,
   children,
   wrapperClass,
   ...buttonProps
}) => {
   const classes = useStyles()
   const buttonClassname = clsx({
      [classes.buttonSuccess]: success
   })
   return (
      <div className={`${classes.wrapper} ${wrapperClass || ''}`}>
         <Button
            {...buttonProps}
            className={`${className} ${buttonClassname}`}
            disabled={loading}
         >
            {children}
         </Button>
         {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
         )}
      </div>
   )
}

export default ButtonLoading
