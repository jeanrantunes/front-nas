import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
   List,
   ListItem,
   ListItemIcon,
   Paper,
   ListItemText,
   ListItemSecondaryAction,
   IconButton,
   Avatar,
   Divider
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Delete } from '@material-ui/icons'

import { requestPatients } from '../../store/actions/patients'
import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'
import AnimatedBadge from '../../components/AnimatedBadge'

const useStyles = makeStyles(theme => ({
   root: {
      width: '100%',
      padding: 0
   },
   listItem: {
      padding: theme.spacing(2)
   }
}))

const Patients = () => {
   const patients = useSelector(store => store.patients)
   const [patientId, setPatientId] = useState(null)
   const dispatch = useDispatch()
   const classes = useStyles()
   const [deleteDialog, setDeleteDialog] = useState(false)

   function deletePatient(id) {
      setPatientId(id)
      setDeleteDialog(true)
   }

   useEffect(() => {
      dispatch(requestPatients())
   }, [dispatch])

   return (
      <Layout>
         <Paper elevation={2}>
            <List className={classes.root}>
               {patients.data.map((patient, index) => {
                  const labelId = `checkbox-list-label-${patient.id}`

                  return (
                     <React.Fragment key={patient.id}>
                        {index !== 0 && <Divider />}

                        <ListItem
                           to={`/patient/${patient.id}`}
                           component={Link}
                           className={classes.listItem}
                           dense
                           button
                        >
                           <ListItemIcon>
                              {patient.outcome === 'pending' ? (
                                 <AnimatedBadge
                                    vertical='bottom'
                                    horizontal='right'
                                    color='success'
                                    overlap='circle'
                                 >
                                    <Avatar>{patient.bed}</Avatar>
                                 </AnimatedBadge>
                              ) : (
                                 //    <Avatar>{patient.bed}</Avatar>
                                 // </StyledBadge>
                                 <Avatar>{patient.bed}</Avatar>
                              )}
                           </ListItemIcon>
                           <ListItemText
                              id={labelId}
                              primary={patient.name}
                              secondary={
                                 patient.outcomeDate
                                    ? `Desfecho: ${
                                         patient.outcome
                                      } - ${new Date(
                                         patient.outcomeDate
                                      ).toUTCString()}`
                                    : patient.hospitalizationDate &&
                                      `Entrada: ${new Date(
                                         patient.hospitalizationDate
                                      ).toUTCString()}`
                              }
                           />
                           <ListItemSecondaryAction>
                              <IconButton
                                 edge='end'
                                 aria-label='delete'
                                 onClick={() => deletePatient(patient.id)}
                              >
                                 <Delete />
                              </IconButton>
                           </ListItemSecondaryAction>
                        </ListItem>
                     </React.Fragment>
                  )
               })}
            </List>
         </Paper>
         {deleteDialog && (
            <DeleteDialog
               deleteDialog={deleteDialog}
               setDeleteDialog={setDeleteDialog}
               patientId={patientId}
            />
         )}
      </Layout>
   )
}

export default Patients
