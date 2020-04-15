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

import { removePatient } from '../../store/actions/patients'

const TransitionDialog = React.forwardRef(function Transition(props, ref) {
   return <Slide direction='up' ref={ref} {...props} />
})

const DialogDeletePatient = props => {
   const dispatch = useDispatch()
   const { deleteDialog, setDeleteDialog, patientId: id } = props

   function deleteConfirm() {
      dispatch(removePatient({ id }))
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
         <DialogTitle id='alert-dialog-slide-title'>
            {'Tem certeza que deseja excluir o paciente?'}
         </DialogTitle>
         <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
               Não será possível desfazer está ação...
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
