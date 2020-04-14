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
   Badge,
   Avatar,
   Divider
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Delete } from '@material-ui/icons'

import {
   requestPatients,
   addPatient,
   updatePatient,
   removePatient
} from '../../store/actions/patients'
import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'

const useStyles = makeStyles(theme => ({
   root: {
      width: '100%',
      padding: 0
   },
   listItem: {
      padding: theme.spacing(2)
   }
}))

const StyledBadge = withStyles(theme => ({
   badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
         position: 'absolute',
         top: -1,
         left: -1,
         width: '100%',
         height: '100%',
         borderRadius: '50%',
         animation: '$ripple 1.2s infinite ease-in-out',
         border: '1px solid currentColor',
         content: '""'
      }
   },
   '@keyframes ripple': {
      '0%': {
         transform: 'scale(.8)',
         opacity: 1
      },
      '100%': {
         transform: 'scale(1.4)',
         opacity: 0
      }
   }
}))(Badge)

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
                                 <StyledBadge
                                    overlap='circle'
                                    anchorOrigin={{
                                       vertical: 'bottom',
                                       horizontal: 'right'
                                    }}
                                    variant='dot'
                                 >
                                    <Avatar>{patient.bed}</Avatar>
                                 </StyledBadge>
                              ) : (
                                 <Avatar>{patient.name[0]}</Avatar>
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
