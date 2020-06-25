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
   InputAdornment,
   Menu,
   MenuItem,
   Typography,
   ListItemIcon,
   Avatar,
   useMediaQuery
} from '@material-ui/core'
import { Pagination, Skeleton } from '@material-ui/lab'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
   Delete,
   FilterList,
   SaveAlt,
   SentimentDissatisfied,
   Close
} from '@material-ui/icons'
import DateRange from '../../components/MaterialDateRange'
import { debounce } from 'lodash-es'

import { enableSteps, enableButtonHelp } from '../../store/actions/stepByStep'

import { requestNas, removeNas } from '../../store/actions/nas'
import api from '../../services/api'

import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'
import { setQueryStringWithoutPageReload } from '../../helpers/queryString'
import useQueryString from '../../hooks/useQueryString'
import { formatPTDateTime } from '../../helpers/date'
import { json2csv } from '../../helpers/csv'

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

const Nas = props => {
   const theme = useTheme()
   const isMobile = useMediaQuery(theme.breakpoints.down('md'))
   const nas = useSelector(store => store.nas)
   const stateLocation = props.location.state
   const [nasId, setNasId] = useState(null)
   const [idNas, setIdNas] = useQueryString('id')
   const [patient_id, setPatientId] = useQueryString('patient_id')
   const [page, setPage] = useQueryString('page', 0)
   const [name, setName] = useQueryString('name')
   const [labelName, setLabelName] = useState()
   const [firstTime, setFirstTime] = useState(true)

   const [created_start_date, setCreatedStartDate] = useQueryString(
      'created_start_date'
   )
   const nameInputRef = useRef(null)
   const idInputRef = useRef(null)
   const dateInputRef = useRef(null)
   const [created_end_date, setCreatedEndDate] = useQueryString(
      'created_end_date'
   )
   const [sortedBy, setSortedBy] = useState(1)
   const [anchorEl, setAnchorEl] = React.useState(null)
   const [disabledName, setDisabledName] = useState(false)
   const openMenuOrder = Boolean(anchorEl)

   const dispatch = useDispatch()
   const classes = useStyles()
   const [deleteDialog, setDeleteDialog] = useState(false)
   const items_per_page = 8

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

   async function getNasForCSV() {
      try {
         const { data } = await api.get(`v1/nas`, {
            params: {
               items_per_page: 'all',
               id: idNas || null,
               name: name || null,
               patient_id: patient_id || null,
               created_start_date,
               created_end_date,
               order_by: options.find(o => o.id === sortedBy).field,
               order_type: options.find(o => o.id === sortedBy).order
            }
         })
         json2csv(data.data, 'nas')
      } catch (error) {
         // console.log(error)
      }
   }

   useEffect(() => {
      if (stateLocation && stateLocation.resetFilter) {
         stateLocation.resetFilter = false
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
   }, [
      stateLocation,
      props.location.search,
      setCreatedEndDate,
      setCreatedStartDate,
      setIdNas,
      setName,
      setPage,
      setPatientId
   ])

   useEffect(() => {
      async function getPatient() {
         try {
            const { data } = await api.get(`v1/patients/${patient_id}`)
            setLabelName(data.name)
         } catch {
            setLabelName(null)
         }
      }

      if (patient_id && firstTime) {
         setFirstTime(false)
         setDisabledName(true)
         getPatient()
         return
      } else if (!patient_id) {
         setDisabledName(false)
      }

      dispatch(
         requestNas({
            items_per_page,
            page,
            id: idNas || null,
            name: name || null,
            patient_id: patient_id || null,
            created_start_date,
            created_end_date,
            order_by: options.find(o => o.id === sortedBy).field,
            order_type: options.find(o => o.id === sortedBy).order
         })
      )
   }, [
      dispatch,
      page,
      name,
      patient_id,
      created_start_date,
      created_end_date,
      idNas,
      sortedBy,
      firstTime
   ])

   useEffect(() => {
      if (!nas.loading && !!nas.data.length) {
         dispatch(enableSteps())
         dispatch(enableButtonHelp())
      }
   }, [nas.loading, nas.data, dispatch])

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

   return (
      <Layout
         {...props}
         steps={[
            {
               element: '.nas-link',
               intro: 'Lista como todos os NAS cadastrados no sistema'
            },
            {
               element: '.filter-nas',
               intro: 'Filtros para os NAS cadastrados no sistema'
            },
            {
               element: '.number-nas',
               intro: 'Filtrar pelo código do NAS'
            },
            {
               element: '.patient-name',
               intro:
                  'Filtrar pelo Nome do paciente. \n Obs: Não precisa ser o nome completo.'
            },
            {
               element: '.created-nas',
               intro: 'Filtrar pela data de criação do NAS'
            },
            {
               element: '.sort-nas',
               intro: 'Ordenar a lista de NAS pela data de criação'
            },
            {
               element: '.clear-nas',
               intro: 'Limpar os filtros aplicados'
            },
            {
               element: '.average-nas',
               intro: 'Pontuação NAS'
            },
            {
               element: '.info-nas',
               intro:
                  'Informações sobre o NAS: Código do NAS, nome do paciente e data de criação do NAS'
            },
            {
               element: '.delete-nas',
               intro: 'Excluir o NAS do sistema'
            }
         ]}
      >
         <Paper elevation={1} className={classes.filter}>
            <Grid container component='main' spacing={2} className='filter-nas'>
               <Grid item xs={12} sm={6} lg={2}>
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
                        ),
                        inputProps: { min: 1 }
                     }}
                     fullWidth
                     disabled={nas.loading}
                     className='number-nas'
                  />
               </Grid>
               <Grid item xs={12} sm={6} lg={4}>
                  <TextField
                     id='name'
                     label='Nome do paciente'
                     autoComplete='off'
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
                     disabled={nas.loading}
                     className='patient-name'
                  />
               </Grid>
               <Grid item xs={12} sm={6} lg={4}>
                  <DateRange
                     startDate={created_start_date}
                     endDate={created_end_date}
                     id='created-range'
                     label='Data de criação'
                     setStartDate={setCreatedStartDate}
                     setEndDate={setCreatedEndDate}
                     inputRef={dateInputRef}
                     disabled={nas.loading}
                     className='created-nas'
                  />
               </Grid>
               <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={2}
                  container
                  direction='row'
                  justify={isMobile ? 'flex-end' : 'center'}
                  alignItems='center'
                  className={classes.filterButtons}
               >
                  <IconButton
                     aria-label='download csv file'
                     aria-controls='long-menu'
                     aria-haspopup='true'
                     onClick={getNasForCSV}
                  >
                     <SaveAlt />
                  </IconButton>
                  <IconButton
                     aria-label='more'
                     aria-controls='long-menu'
                     aria-haspopup='true'
                     onClick={e => setAnchorEl(e.currentTarget)}
                     className='sort-nas'
                  >
                     <FilterList />
                  </IconButton>
                  <Menu
                     id='long-menu'
                     anchorEl={anchorEl}
                     keepMounted
                     open={openMenuOrder}
                     onClose={() => setAnchorEl(null)}
                     disabled={nas.loading}
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
                     className='clear-nas'
                  >
                     <Close />
                  </IconButton>
               </Grid>
            </Grid>
         </Paper>
         <Paper elevation={2} className={classes.items}>
            {nas.loading ? (
               <SkeletonList />
            ) : (
               <List className={classes.list}>
                  {nas.data && nas.data.length ? (
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
                                       <Avatar
                                          className={`${classes.average} average-nas`}
                                       >
                                          {nas.average.toFixed(1)}
                                       </Avatar>
                                    </ListItemIcon>
                                 )}
                                 <Grid item xs={7} sm={10} md={12}>
                                    <ListItemText
                                       id={labelId}
                                       primary={`N${nas.id}`}
                                       secondary={`${
                                          nas.patient.name
                                       } - ${formatPTDateTime(nas.nas_date)}`}
                                       className='info-nas'
                                    />
                                 </Grid>
                                 <ListItemSecondaryAction>
                                    <IconButton
                                       edge='end'
                                       aria-label='delete'
                                       onClick={() => deletePatient(nas.id)}
                                       className='delete-nas'
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

         {nas.metadata && nas.metadata.total > items_per_page && (
            <div className={classes.pagination}>
               <Pagination
                  count={Math.ceil(
                     nas.metadata.total / nas.metadata.items_per_page
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
      </Layout>
   )
}

export default Nas
