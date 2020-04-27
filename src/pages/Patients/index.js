import React, { useState, useEffect, useRef } from 'react'
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
   CircularProgress,
   Menu
} from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Delete, FilterList, Close } from '@material-ui/icons'
import DateRange from '../../components/MaterialDateRange'
import { debounce } from 'lodash-es'

import { requestPatients, removePatient } from '../../store/actions/patients'
import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'
import AnimatedBadge from '../../components/AnimatedBadge'

const options = [
   {
      id: 1,
      label: 'Mais recentes',
      field: 'hospitalizationDate',
      order: 'DESC'
   },
   {
      id: 2,
      label: 'Mais antigos',
      field: 'hospitalizationDate',
      order: 'ASC'
   }
]

const useStyles = makeStyles(theme => ({
   items: {
      width: '100%',
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
   },
   containerLoading: {
      minHeight: 300
   },
   list: {
      width: '100%',
      padding: 0
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
   },
   filterButtons: {
      flexFlow: 'row'
   }
}))

const Patients = () => {
   const patients = useSelector(store => store.patients)

   const [patientId, setPatientId] = useState(null)
   const [page, setPage] = useState(0)
   const [name, setName] = useState('')
   const [outcome, setOutcome] = useState('')
   const [bed, setBed] = useState('')
   const [hospitalizationStartDate, setHospitalizationStartDate] = useState(
      null
   )
   const [hospitalizationEndDate, setHospitalizationEndDate] = useState(null)
   const [outcomeStartDate, setOutcomeStartDate] = useState(null)
   const [outcomeEndDate, setOutcomeEndDate] = useState(null)
   const [anchorEl, setAnchorEl] = React.useState(null)
   const [sortedBy, setSortedBy] = useState(1)
   const openMenuOrder = Boolean(anchorEl)

   const nameInputRef = useRef(null)
   const outcomeInputRef = useRef(null)
   const bedInputRef = useRef(null)
   const hospitalizationInputRef = useRef(null)
   const outcomeDateInputRef = useRef(null)

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

   function handlePagination(e, page) {
      setPage(page - 1)
   }

   function handleOrder(selected) {
      setSortedBy(selected.id)
      setAnchorEl(null)
   }

   function cleanFilters() {
      setPage(0)
      setName('')
      setOutcome('')
      setBed('')
      setHospitalizationEndDate(null)
      setHospitalizationStartDate(null)
      setOutcomeEndDate(null)
      setOutcomeStartDate(null)
      setSortedBy(1)
      nameInputRef.current.value = ''
      outcomeInputRef.current.value = ''
      bedInputRef.current.value = ''
      hospitalizationInputRef.current.value = ''
      outcomeInputRef.current.value = ''
   }

   useEffect(() => {
      dispatch(
         requestPatients({
            itemsPerPage,
            page,
            name: name.length ? name : null,
            outcome: outcome.length ? outcome : null,
            bed: bed.length ? bed : null,
            hospitalizationStartDate,
            hospitalizationEndDate,
            outcomeStartDate,
            outcomeEndDate,
            orderBy: options.find(o => o.id === sortedBy).field,
            orderType: options.find(o => o.id === sortedBy).order
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
      outcomeEndDate,
      sortedBy
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
                     inputRef={nameInputRef}
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
                        inputRef={outcomeInputRef}
                        onChange={e => setOutcome(e.target.value)}
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
                        inputRef={bedInputRef}
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
                     inputRef={hospitalizationInputRef}
                     setStartDate={setHospitalizationStartDate}
                     setEndDate={setHospitalizationEndDate}
                  />
               </Grid>
               <Grid item xs={11} sm={5}>
                  <DateRange
                     startDate={outcomeStartDate}
                     endDate={outcomeEndDate}
                     id='outcome-range'
                     label='Período desfecho'
                     inputRef={outcomeDateInputRef}
                     setStartDate={setOutcomeStartDate}
                     setEndDate={setOutcomeEndDate}
                  />
               </Grid>
               <Grid
                  item
                  xs={1}
                  container
                  direction='row'
                  justify='center'
                  alignItems='center'
                  className={classes.filterButtons}
               >
                  <IconButton
                     aria-label='more'
                     aria-controls='long-menu'
                     aria-haspopup='true'
                     onClick={e => setAnchorEl(e.currentTarget)}
                  >
                     <FilterList />
                  </IconButton>
                  <Menu
                     id='long-menu'
                     anchorEl={anchorEl}
                     keepMounted
                     open={openMenuOrder}
                     onClose={() => setAnchorEl(null)}
                  >
                     {options.map(option => (
                        <MenuItem
                           key={option.id}
                           selected={option.id === sortedBy}
                           onClick={() => handleOrder(option)}
                        >
                           {option.label}
                        </MenuItem>
                     ))}
                  </Menu>
                  <IconButton
                     aria-label='more'
                     aria-controls='long-menu'
                     aria-haspopup='true'
                     onClick={cleanFilters}
                  >
                     <Close />
                  </IconButton>
               </Grid>
            </Grid>
         </Paper>
         <Paper elevation={2} className={classes.items}>
            {patients.loading ? (
               <div className={classes.containerLoading}>
                  <CircularProgress />
               </div>
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
                                    <Avatar>{patient.bed}</Avatar>
                                 )}
                              </ListItemIcon>
                              <ListItemText
                                 id={labelId}
                                 primary={patient.name}
                                 secondary={
                                    `Data da internação: ${patient.hospitalizationDate}`
                                    // patient.outcomeDate
                                    //    && `Desfecho: ${
                                    //         patient.outcome
                                    //      } - ${new Date(
                                    //         patient.outcomeDate
                                    //      ).toUTCString()}`
                                    //    : patient.hospitalizationDate &&
                                    //      `Entrada: ${new Date(
                                    //         patient.hospitalizationDate
                                    //      ).toUTCString()}`
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
                  count={Math.ceil(
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
