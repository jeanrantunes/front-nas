import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
   Grid,
   List,
   ListItem,
   Paper,
   ListItemText,
   ListItemSecondaryAction,
   IconButton,
   Divider,
   TextField,
   CircularProgress,
   InputAdornment,
   Menu,
   MenuItem,
   Typography,
   ListItemIcon,
   Avatar
} from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import {
   Delete,
   FilterList,
   SentimentDissatisfied,
   Close
} from '@material-ui/icons'
import DateRange from '../../components/MaterialDateRange'
import { debounce } from 'lodash-es'

import { requestNas, removeNas } from '../../store/actions/nas'
import api from '../../services/api'

import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'
import NasDialog from '../../containers/DialogLateNas'
import { setQueryStringWithoutPageReload } from '../../helpers/queryString'
import useQueryString from '../../hooks/useQueryString'
import { formatPTDateTime } from '../../helpers/date'

const options = [
   {
      id: 1,
      label: 'Mais recentes',
      field: 'created_at',
      order: 'DESC'
   },
   {
      id: 2,
      label: 'Mais antigos',
      field: 'created_at',
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
   info: {
      padding: theme.spacing(5),
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center'
   },
   filterButtons: {
      flexFlow: 'row'
   },
   average: {
      fontSize: '0.9rem'
   }
}))

const Nas = props => {
   const nas = useSelector(store => store.nas)
   const patients = useSelector(store => store.patients)
   const stateLocation = props.location.state
   const [nasId, setNasId] = useState(null)
   const [page, setPage] = useQueryString('page')
   const [name, setName] = useQueryString('name')
   const [labelName, setLabelName] = useState()
   const [firstTime, setFirstTime] = useState(true)

   const [idNas, setIdNas] = useQueryString('id')
   const [patientId, setPatientId] = useQueryString('patientId')
   const [createdStartDate, setCreatedStartDate] = useQueryString(
      'createdStartDate'
   )
   const nameInputRef = useRef(null)
   const idInputRef = useRef(null)
   const dateInputRef = useRef(null)
   const [createdEndDate, setCreatedEndDate] = useQueryString('createdEndDate')
   const [sortedBy, setSortedBy] = useState(1)
   const [anchorEl, setAnchorEl] = React.useState(null)
   const [disabledName, setDisabledName] = useState(false)

   const openMenuOrder = Boolean(anchorEl)

   const dispatch = useDispatch()
   const classes = useStyles()
   const [deleteDialog, setDeleteDialog] = useState(false)
   const itemsPerPage = 8

   const handleInputName = debounce(name => {
      setPage(0)
      setName(name)
   }, 1000)

   const handleIDNas = debounce(id => {
      setPage(0)
      if (isNaN(id) || !id) {
         setIdNas(null)
         return
      }
      setIdNas(id)
   }, 1000)

   function deletePatient(id) {
      setNasId(id)
      setDeleteDialog(true)
   }

   function handleOrder(selected) {
      setSortedBy(selected.id)
      setAnchorEl(null)
   }

   function handlePagination(e, page) {
      setPage(page - 1)
   }

   async function getPatient() {
      try {
         const { data } = await api.get(`v1/patients/${patientId}`)
         setLabelName(data.name)
      } catch {
         setLabelName(null)
      }
   }

   function cleanFilters() {
      setLabelName(null)
      setPage(0)
      setName(null)
      setIdNas(null)
      setCreatedEndDate(null)
      setCreatedStartDate(null)
      setDisabledName(false)
      setPatientId(null)
      setSortedBy(1)
      setQueryStringWithoutPageReload('')
      props.location.search = ''
      idInputRef.current.value = ''
      nameInputRef.current.value = ''
      dateInputRef.current.value = ''
   }

   useEffect(() => {
      if (stateLocation && stateLocation.resetFilter) {
         stateLocation.resetFilter = false
         cleanFilters()
         return
      }
      if (patientId && firstTime) {
         setFirstTime(false)
         setDisabledName(true)
         if (!patients.data.length) {
            getPatient()
         } else {
            const { data } = patients
            const p = data.find(p => p.id === patientId)
            if (p.name) {
               setLabelName(p.name)
            }
         }
      } else if (!patientId) {
         setDisabledName(false)
      }
      dispatch(
         requestNas({
            itemsPerPage,
            page,
            id: idNas || null,
            name: name || null,
            patientId: patientId || null,
            createdStartDate,
            createdEndDate,
            orderBy: options.find(o => o.id === sortedBy).field,
            orderType: options.find(o => o.id === sortedBy).order
         })
      )
   }, [
      dispatch,
      page,
      name,
      patientId,
      createdStartDate,
      createdEndDate,
      idNas,
      sortedBy,
      stateLocation
   ])

   return (
      <Layout>
         <Paper elevation={1} className={classes.filter}>
            <Grid container component='main' spacing={2}>
               <Grid item xs={12} sm={3}>
                  <TextField
                     id='id-nas'
                     label='Código nas'
                     variant='outlined'
                     type='number'
                     inputRef={idInputRef}
                     defaultValue={idNas}
                     onChange={e => handleIDNas(e.target.value)}
                     InputProps={{
                        startAdornment: (
                           <InputAdornment position='start'>N</InputAdornment>
                        )
                     }}
                     fullWidth
                  />
               </Grid>
               <Grid item xs={12} sm={4}>
                  <TextField
                     id='name'
                     label='Nome do paciente'
                     variant='outlined'
                     defaultValue={name}
                     inputRef={nameInputRef}
                     onChange={e => handleInputName(e.target.value)}
                     fullWidth
                     InputProps={{
                        readOnly: disabledName,
                        ...(labelName
                           ? {
                                startAdornment: (
                                   <InputAdornment position='start'>
                                      {labelName}
                                   </InputAdornment>
                                )
                             }
                           : {})
                     }}
                  />
               </Grid>
               <Grid item xs={11} sm={4}>
                  <DateRange
                     startDate={createdStartDate}
                     endDate={createdEndDate}
                     id='created-range'
                     label='Data de criação'
                     setStartDate={setCreatedStartDate}
                     setEndDate={setCreatedEndDate}
                     inputRef={dateInputRef}
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
            {nas.loading ? (
               <div className={classes.containerLoading}>
                  <CircularProgress />
               </div>
            ) : (
               <List className={classes.list}>
                  {nas.data ? (
                     nas.data.map((nas, index) => {
                        const labelId = `checkbox-list-label-${nas.id}`
                        return (
                           <React.Fragment key={nas.id}>
                              {index !== 0 && <Divider />}

                              <ListItem
                                 to={`/nas/${nas.id}`}
                                 component={Link}
                                 className={classes.listItem}
                                 dense
                                 button
                              >
                                 {nas.average && (
                                    <ListItemIcon>
                                       <Avatar className={classes.average}>
                                          {nas.average.toFixed(1)}
                                       </Avatar>
                                    </ListItemIcon>
                                 )}
                                 <ListItemText
                                    id={labelId}
                                    primary={`N${nas.id}`}
                                    secondary={`${
                                       nas.patient.name
                                    } - ${formatPTDateTime(nas.nasDate)}`}
                                 />
                                 <ListItemSecondaryAction>
                                    <IconButton
                                       edge='end'
                                       aria-label='delete'
                                       onClick={() => deletePatient(nas.id)}
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
         {nas.metadata && nas.metadata.total > itemsPerPage && (
            <div className={classes.pagination}>
               <Pagination
                  count={Math.ceil(
                     nas.metadata.total / nas.metadata.itemsPerPage
                  )}
                  size='large'
                  onChange={handlePagination}
               />
            </div>
         )}
         {deleteDialog && (
            <DeleteDialog
               title={'Tem certeza que deseja excluir este registro?'}
               text={' Não será possível desfazer está ação...'}
               deleteDialog={deleteDialog}
               setDeleteDialog={setDeleteDialog}
               id={nasId}
               funcRemove={removeNas}
            />
         )}
         <NasDialog typeButton='fab' />
      </Layout>
   )
}

export default Nas
