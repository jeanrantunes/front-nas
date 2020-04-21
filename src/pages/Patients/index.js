import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
   Grid,
   List,
   ListItem,
   ListItemIcon,
   Paper,
   ListItemText,
   ListItemSecondaryAction,
   IconButton,
   Avatar,
   Divider,
   TextField,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   CircularProgress
} from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Delete } from '@material-ui/icons'
import DateRange from '../../components/MaterialDateRange'
import { debounce } from 'lodash-es'

import { requestPatients, removePatient } from '../../store/actions/patients'
import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'
import AnimatedBadge from '../../components/AnimatedBadge'
import { height } from '@material-ui/system'

const useStyles = makeStyles(theme => ({
   items: {
      width: '100%',
      minHeight: 300,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
   },
   list: {
      width: '100%'
   },
   filter: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(3)
   },
   listItem: {
      padding: theme.spacing(2)
   },
   pagination: {
      marginTop: theme.spacing(5),
      display: 'flex',
      justifyContent: 'center'
   }
}))

const Patients = () => {
   const patients = useSelector(store => store.patients)

   const [patientId, setPatientId] = useState(null)
   const [page, setPage] = useState(0)
   const [name, setName] = useState('')
   const [nameIsItEdit, setNameIsItEdit] = useState(false)
   const [outcome, setOutcome] = useState('')
   const [bed, setBed] = useState('')
   const [hospitalizationStartDate, setHospitalizationStartDate] = useState(
      null
   )
   const [hospitalizationEndDate, setHospitalizationEndDate] = useState(null)
   const [outcomeStartDate, setOutcomeStartDate] = useState(null)
   const [outcomeEndDate, setOutcomeEndDate] = useState(null)

   const dispatch = useDispatch()
   const classes = useStyles()
   const [deleteDialog, setDeleteDialog] = useState(false)
   const itemsPerPage = 8

   const handleInputName = debounce(name => {
      setName(name)
   }, 1000)

   function deletePatient(id) {
      setPatientId(id)
      setDeleteDialog(true)
   }

   function handlePagination(event, page) {
      setPage(page - 1)
   }

   useEffect(() => {
      dispatch(
         requestPatients({
            itemsPerPage,
            page,
            name: name.length ? name : null,
            outcome: outcome.length ? outcome : null,
            bed: bed.length || null,
            hospitalizationStartDate,
            hospitalizationEndDate,
            outcomeStartDate,
            outcomeEndDate
         })
      )
   }, [
      dispatch,
      page,
      name,
      outcome,
      bed,
      hospitalizationStartDate,
      hospitalizationEndDate,
      outcomeStartDate,
      outcomeEndDate
   ])

   return (
      <Layout>
         <Paper elevation={1} className={classes.filter}>
            <Grid container component='main' spacing={2}>
               <Grid item xs={12} sm={6} md={4}>
                  <TextField
                     id='name'
                     label='Nome'
                     variant='outlined'
                     onChange={e => handleInputName(e.target.value)}
                     fullWidth
                  />
               </Grid>
               <Grid item xs={12} sm={6} md={4}>
                  <FormControl variant='outlined' fullWidth>
                     <InputLabel id='outcome-label'>Desfecho</InputLabel>
                     <Select
                        labelId='outcome-label'
                        id='outcome'
                        value={outcome}
                        onChange={handleInputName}
                        label='Desfecho'
                     >
                        <MenuItem value=''>
                           <em>Todos</em>
                        </MenuItem>
                        <MenuItem value={'pending'}>Internado</MenuItem>
                        <MenuItem value={'dischage'}>Alta</MenuItem>
                        <MenuItem value={'death'}>Óbito</MenuItem>
                     </Select>
                  </FormControl>
               </Grid>
               <Grid item xs={12} sm={6} md={4}>
                  <FormControl variant='outlined' fullWidth>
                     <InputLabel id='bed-label'>Leito</InputLabel>
                     <Select
                        labelId='bed-label'
                        id='bed'
                        value={bed}
                        onChange={e => setBed(e.target.value)}
                        label='Leito'
                     >
                        <MenuItem value=''>
                           <em>Todos</em>
                        </MenuItem>
                        <MenuItem value={'A'}>A</MenuItem>
                        <MenuItem value={'B'}>B</MenuItem>
                        <MenuItem value={'C'}>C</MenuItem>
                        <MenuItem value={'D'}>D</MenuItem>
                        <MenuItem value={'E'}>E</MenuItem>
                        <MenuItem value={'F'}>F</MenuItem>
                     </Select>
                  </FormControl>
               </Grid>
               <Grid item xs={12} sm={6}>
                  <DateRange
                     startDate={hospitalizationStartDate}
                     endDate={hospitalizationEndDate}
                     id='hospitalization-range'
                     label='Período de internação'
                     setStartDate={setHospitalizationStartDate}
                     setEndDate={setHospitalizationEndDate}
                  />
               </Grid>
               <Grid item xs={12} sm={6}>
                  <DateRange
                     startDate={outcomeStartDate}
                     endDate={outcomeEndDate}
                     id='outcome-range'
                     label='Período desfecho'
                     setStartDate={setOutcomeStartDate}
                     setEndDate={setOutcomeEndDate}
                  />
               </Grid>
            </Grid>
         </Paper>
         <Paper elevation={2} className={classes.items}>
            {patients.loading ? (
               <CircularProgress />
            ) : (
               <List className={classes.list}>
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
            )}
         </Paper>
         {patients.metadata && patients.metadata.total > itemsPerPage && (
            <div className={classes.pagination}>
               <Pagination
                  count={Math.round(
                     patients.metadata.total / patients.metadata.itemsPerPage
                  )}
                  size='large'
                  onChange={handlePagination}
               />
            </div>
         )}
         {deleteDialog && (
            <DeleteDialog
               title={'Tem certeza que deseja excluir o paciente?'}
               text={' Não será possível desfazer está ação...'}
               deleteDialog={deleteDialog}
               setDeleteDialog={setDeleteDialog}
               id={patientId}
               funcRemove={removePatient}
            />
         )}
      </Layout>
   )
}

export default Patients
