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
   Menu,
   Typography,
   useMediaQuery
} from '@material-ui/core'
import { Pagination, Skeleton } from '@material-ui/lab'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
   Delete,
   FilterList,
   Close,
   SentimentDissatisfied
} from '@material-ui/icons'
import DateRange from '../../components/MaterialDateRange'
import { debounce } from 'lodash-es'
import { formatPTDateTime } from '../../helpers/date'

import { requestPatients, removePatient } from '../../store/actions/patients'
import { enableSteps, enableButtonHelp } from '../../store/actions/stepByStep'
import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'
import AnimatedBadge from '../../components/AnimatedBadge'

const options = [
   {
      id: 1,
      label: 'Mais recentes',
      field: 'hospitalization_date',
      order: 'DESC'
   },
   {
      id: 2,
      label: 'Mais antigos',
      field: 'hospitalization_date',
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
   },
   info: {
      padding: theme.spacing(5),
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center'
   }
}))

const SkeletonList = () => {
   const classes = useStyles()
   const array = []
   for (let i = 0; i < 10; i++) {
      array.push(
         <React.Fragment key={i}>
            {i !== 0 && <Divider />}
            <ListItem className={classes.listItem} dense button>
               <ListItemIcon>
                  <Skeleton
                     animation='wave'
                     variant='circle'
                     width={40}
                     height={40}
                  />
               </ListItemIcon>
               <Grid item xs={7} sm={10} md={12}>
                  <ListItemText
                     primary={
                        <Skeleton
                           animation='wave'
                           height={20}
                           width='60%'
                           style={{ marginBottom: 6 }}
                        />
                     }
                     secondary={
                        <Skeleton
                           animation='wave'
                           height={20}
                           width='30%'
                           style={{ marginBottom: 6 }}
                        />
                     }
                  />
               </Grid>
            </ListItem>
         </React.Fragment>
      )
   }
   return <List className={classes.list}>{array}</List>
}

const Patients = props => {
   const patients = useSelector(store => store.patients)

   const theme = useTheme()
   const isMobile = useMediaQuery(theme.breakpoints.down('md'))
   const [patientId, setPatientId] = useState(null)
   const [page, setPage] = useState(0)
   const [name, setName] = useState('')
   const [outcome, setOutcome] = useState('')
   const [bed, setBed] = useState('')
   const [hospitalization_start_date, setHospitalizationStartDate] = useState(
      null
   )
   const [hospitalization_end_date, setHospitalizationEndDate] = useState(null)
   const [outcome_start_date, setOutcomeStartDate] = useState(null)
   const [outcome_end_date, setOutcomeEndDate] = useState(null)
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
   const items_per_page = 8

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
            items_per_page,
            page,
            name: name.length ? name : null,
            outcome: outcome.length ? outcome : null,
            bed: bed.length ? bed : null,
            hospitalization_start_date,
            hospitalization_end_date,
            outcome_start_date,
            outcome_end_date,
            order_by: options.find(o => o.id === sortedBy).field,
            order_type: options.find(o => o.id === sortedBy).order
         })
      )
   }, [
      dispatch,
      page,
      name,
      outcome,
      bed,
      hospitalization_start_date,
      hospitalization_end_date,
      outcome_start_date,
      outcome_end_date,
      sortedBy
   ])

   useEffect(() => {
      if (!patients.loading && !!patients.data.length) {
         dispatch(enableButtonHelp())
         dispatch(enableSteps())
      }
   }, [patients.loading, patients.data, dispatch])

   return (
      <Layout
         {...props}
         steps={[
            {
               element: '.patients-link',
               intro: 'Lista como todos os pacientes cadastrados no sistema'
            },
            {
               element: '.filter-patients',
               intro: 'Filtros para os pacientes'
            },
            {
               element: '.name-patient',
               intro: 'Filtrar pelo nome do paciente'
            },
            {
               element: '.outcome-patient',
               intro: 'Filtrar pelo desfecho do paciente do paciente'
            },
            {
               element: '.bed-filter-patient',
               intro: 'Filtrar pelos leitos da UTI'
            },
            {
               element: '.hospitalization-patient',
               intro: 'Filtrar pela data de internação'
            },
            {
               element: '.outcome-date-patient',
               intro: 'Filtrar pela data do desfecho'
            },
            {
               element: '.sort-patient',
               intro: 'Ordenar os pacientes pela data de internação'
            },
            {
               element: '.clear-patient',
               intro: 'Limpar os filtros'
            },
            {
               element: '.bed-patient',
               intro: 'Leito do paciente'
            },
            {
               element: '.info-patient',
               intro: 'Informações sobre o paciente'
            },
            {
               element: '.delete-patient',
               intro: 'Excluir o paciente do sistema'
            }
         ]}
      >
         <Paper elevation={1} className={`${classes.filter} filter-patients`}>
            <Grid container component='main' spacing={2}>
               <Grid item xs={12} sm={6} lg={4}>
                  <TextField
                     id='name'
                     autoComplete='off'
                     label='Nome'
                     variant='outlined'
                     inputRef={nameInputRef}
                     onChange={e => handleInputName(e.target.value)}
                     fullWidth
                     disabled={patients.loading}
                     className='name-patient'
                  />
               </Grid>
               <Grid item xs={12} sm={6} lg={4}>
                  <FormControl
                     variant='outlined'
                     fullWidth
                     className='outcome-patient'
                  >
                     <InputLabel id='outcome-label'>Desfecho</InputLabel>
                     <Select
                        labelId='outcome-label'
                        id='outcome'
                        value={outcome}
                        inputRef={outcomeInputRef}
                        onChange={e => setOutcome(e.target.value)}
                        label='Desfecho'
                        disabled={patients.loading}
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
               <Grid item xs={12} sm={6} lg={4}>
                  <FormControl
                     variant='outlined'
                     fullWidth
                     className='bed-filter-patient'
                  >
                     <InputLabel id='bed-label'>Leito</InputLabel>
                     <Select
                        labelId='bed-label'
                        id='bed'
                        value={bed}
                        inputRef={bedInputRef}
                        onChange={e => setBed(e.target.value)}
                        label='Leito'
                        disabled={patients.loading}
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
               <Grid item xs={12} sm={6} lg={6}>
                  <DateRange
                     startDate={hospitalization_start_date}
                     endDate={hospitalization_end_date}
                     id='hospitalization-range'
                     label='Período de internação'
                     inputRef={hospitalizationInputRef}
                     setStartDate={setHospitalizationStartDate}
                     setEndDate={setHospitalizationEndDate}
                     disabled={patients.loading}
                     className='hospitalization-patient'
                  />
               </Grid>
               <Grid item xs={12} sm={6} lg={5}>
                  <DateRange
                     startDate={outcome_start_date}
                     endDate={outcome_end_date}
                     id='outcome-range'
                     label='Período desfecho'
                     inputRef={outcomeDateInputRef}
                     setStartDate={setOutcomeStartDate}
                     setEndDate={setOutcomeEndDate}
                     disabled={patients.loading}
                     className='outcome-date-patient'
                  />
               </Grid>
               <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={1}
                  container
                  direction='row'
                  justify={isMobile ? 'flex-end' : 'center'}
                  alignItems='center'
                  className={classes.filterButtons}
               >
                  <IconButton
                     aria-label='more'
                     aria-controls='long-menu'
                     aria-haspopup='true'
                     className='sort-patient'
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
                     disabled={patients.loading}
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
                     className='clear-patient'
                     onClick={cleanFilters}
                  >
                     <Close />
                  </IconButton>
               </Grid>
            </Grid>
         </Paper>
         <Paper elevation={2} className={classes.items}>
            {patients.loading ? (
               <SkeletonList />
            ) : (
               <List className={classes.list}>
                  {patients.data && patients.data.length ? (
                     patients.data.map((patient, index) => {
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
                                          color='#76ff03'
                                          overlap='circle'
                                       >
                                          <Avatar className='bed-patient'>
                                             {patient.bed}
                                          </Avatar>
                                       </AnimatedBadge>
                                    ) : (
                                       <Avatar>{patient.bed}</Avatar>
                                    )}
                                 </ListItemIcon>
                                 <Grid item xs={7} sm={10} md={12}>
                                    <ListItemText
                                       className='info-patient'
                                       id={labelId}
                                       primary={patient.name}
                                       secondary={
                                          `Data da internação: ${formatPTDateTime(
                                             // getDateInCurrentTimeZone(
                                             patient.hospitalization_date
                                             // )
                                          )}`
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
                                 </Grid>
                                 <ListItemSecondaryAction>
                                    <IconButton
                                       className='delete-patient'
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
                     })
                  ) : (
                     <Typography
                        className={classes.info}
                        variant='subtitle1'
                        align='center'
                     >
                        Não há registros... <SentimentDissatisfied />
                     </Typography>
                  )}
               </List>
            )}
         </Paper>
         {patients.metadata && patients.metadata.total > items_per_page && (
            <div className={classes.pagination}>
               <Pagination
                  count={Math.ceil(
                     patients.metadata.total / patients.metadata.items_per_page
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
