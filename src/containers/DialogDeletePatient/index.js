import React from 'react'
import { useDispatch } from 'react-redux'
import {
   Button,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   Slide
} from '@material-ui/core'

// import { removePatient } from '../../store/actions/patients'

const TransitionDialog = React.forwardRef(function Transition(props, ref) {
   return <Slide direction='up' ref={ref} {...props} />
})

const DialogDeletePatient = props => {
   const dispatch = useDispatch()
   const { title, text, deleteDialog, setDeleteDialog, id, funcRemove } = props

   function deleteConfirm() {
      dispatch(funcRemove({ id }))
      setDeleteDialog(false)
   }

   return (
      <Dialog
         open={deleteDialog}
         TransitionComponent={TransitionDialog}
         keepMounted
         onClose={() => setDeleteDialog(false)}
         aria-labelledby='alert-dialog-slide-title'
         aria-describedby='alert-dialog-slide-description'
      >
         <DialogTitle id='alert-dialog-slide-title'>{title}</DialogTitle>
         <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
               {text}
            </DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button onClick={() => setDeleteDialog(false)} color='primary'>
               Não
            </Button>
            <Button onClick={deleteConfirm} color='primary'>
               Sim
            </Button>
         </DialogActions>
      </Dialog>
   )
}

export default DialogDeletePatient
