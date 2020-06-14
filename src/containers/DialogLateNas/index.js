import React, { useState } from 'react'

import { withStyles, makeStyles } from '@material-ui/core/styles'
import {
   Button,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   IconButton,
   Typography,
   Fab
} from '@material-ui/core'
import { Close, Add } from '@material-ui/icons'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import api from '../../services/api'
import pt from 'date-fns/locale/pt-BR'

const styles = theme => ({
   root: {
      margin: 0,
      padding: theme.spacing(2)
   },
   closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
   }
})

const useStyles = makeStyles(theme => ({
   fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2)
   },
   dialog: {},
   inputDate: {
      width: 260
   }
}))

const Title = withStyles(styles)(props => {
   const { children, classes, onClose, ...other } = props
   return (
      <DialogTitle disableTypography className={classes.root} {...other}>
         <Typography variant='h6'>{children}</Typography>
         {onClose ? (
            <IconButton
               aria-label='close'
               className={classes.closeButton}
               onClick={onClose}
            >
               <Close />
            </IconButton>
         ) : null}
      </DialogTitle>
   )
})

const Content = withStyles(theme => ({
   root: {
      padding: theme.spacing(2)
   }
}))(DialogContent)

const Actions = withStyles(theme => ({
   root: {
      margin: 0,
      padding: theme.spacing(1)
   }
}))(DialogActions)

const DialogLateNas = props => {
   const { typeButton, variant, patient_id, history, classNameButton } = props
   let { color, textButton, title, textButtonAction } = props
   const classes = useStyles()
   const [open, setOpen] = useState(false)
   const [error, setError] = useState(false)
   const [selectedDate, handleDateChange] = useState(new Date())

   if (!patient_id) {
      console.warn('You must provide a patient id')
      return
   }

   if (!color) {
      color = 'primary'
   }
   if (!textButton) {
      textButton = 'button text'
   }
   if (!title) {
      title = 'Algum título'
   }
   if (!textButtonAction) {
      textButtonAction = 'Cadastrar'
   }

   const handleClickOpen = () => {
      setError(false)
      setOpen(true)
   }

   const handleClickSubmit = async () => {
      if (!patient_id || !selectedDate) {
         return
      }
      const date = new Date(selectedDate).toDateString()

      try {
         const {
            data: {
               metadata: { total: t }
            }
         } = await api.get('v1/nas', {
            params: {
               patient_id,
               created_start_date: date
            }
         })
         if (t > 0) {
            setError(true)
            return
         }
         setError(false)
         history.push(`/nas/${patient_id}?nas_date=${date}`)
      } catch (err) {
         setError(true)
      }
   }

   const handleClose = () => {
      setOpen(false)
   }

   return (
      <React.Fragment>
         {typeButton === 'fab' ? (
            <Fab
               color={color}
               onClick={handleClickOpen}
               className={`${classes.fab} ${classNameButton}`}
            >
               <Add />
            </Fab>
         ) : (
            <Button
               variant={variant}
               color={color}
               className={classNameButton}
               onClick={handleClickOpen}
            >
               {textButton}
            </Button>
         )}

         <Dialog
            className={classes.dialog}
            maxWidth='sm'
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            open={open}
         >
            <Title id='customized-dialog-title' onClose={handleClose}>
               {title}
            </Title>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pt}>
               <Content dividers>
                  <DatePicker
                     label='Data do NAS'
                     format='dd/MM/yyyy'
                     value={selectedDate}
                     onChange={handleDateChange}
                     inputVariant='outlined'
                     maxDate={new Date()}
                     className={classes.inputDate}
                     helperText={error && 'Já existe um NAS com esta data'}
                     error={error}
                  />
               </Content>
            </MuiPickersUtilsProvider>
            <Actions>
               <Button autoFocus onClick={handleClickSubmit} color='primary'>
                  {textButtonAction}
               </Button>
            </Actions>
         </Dialog>
      </React.Fragment>
   )
}

export default DialogLateNas
