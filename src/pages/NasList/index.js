import React, { useState, useEffect } from 'react'
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
   InputAdornment
} from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core/styles'
import { Delete } from '@material-ui/icons'
import DateRange from '../../components/MaterialDateRange'
import { debounce } from 'lodash-es'

import { requestNas, removeNas } from '../../store/actions/nas'
import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'

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

const Nas = () => {
   const nas = useSelector(store => store.nas)

   const [nasId, setNasId] = useState(null)
   const [page, setPage] = useState(0)
   const [name, setName] = useState('')
   const [idNas, setIdNas] = useState(null)
   const [createdStartDate, setCreatedStartDate] = useState(null)
   const [createdEndDate, setCreatedEndDate] = useState(null)

   const dispatch = useDispatch()
   const classes = useStyles()
   const [deleteDialog, setDeleteDialog] = useState(false)
   const itemsPerPage = 8

   const handleInputName = debounce(name => {
      setName(name)
   }, 1000)

   const handleIDNas = debounce(id => {
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

   function handlePagination(page) {
      setPage(page - 1)
   }

   useEffect(() => {
      dispatch(
         requestNas({
            itemsPerPage,
            page,
            id: idNas || null,
            name: name.length ? name : null,
            createdStartDate,
            createdEndDate
         })
      )
   }, [dispatch, page, name, createdStartDate, createdEndDate, idNas])

   return (
      <Layout>
         <Paper elevation={1} className={classes.filter}>
            <Grid container component='main' spacing={2}>
               <Grid item xs={12} sm={4}>
                  <TextField
                     id='id-nas'
                     label='Código nas'
                     variant='outlined'
                     type='number'
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
                     label='Nome'
                     variant='outlined'
                     onChange={e => handleInputName(e.target.value)}
                     fullWidth
                  />
               </Grid>
               <Grid item xs={12} sm={4}>
                  <DateRange
                     startDate={createdStartDate}
                     endDate={createdEndDate}
                     id='created-range'
                     label='Data de criação'
                     setStartDate={setCreatedStartDate}
                     setEndDate={setCreatedEndDate}
                  />
               </Grid>
            </Grid>
         </Paper>
         <Paper elevation={2} className={classes.items}>
            {nas.loading ? (
               <div className={classes.containerLoading}>
                  {' '}
                  <CircularProgress />
               </div>
            ) : (
               <List className={classes.list}>
                  {nas.data &&
                     nas.data.map((nas, index) => {
                        const labelId = `checkbox-list-label-${nas.id}`
                        return (
                           <React.Fragment key={nas.id}>
                              {index !== 0 && <Divider />}

                              <ListItem
                                 to={`/nas/${nas.patientId}`}
                                 component={Link}
                                 className={classes.listItem}
                                 dense
                                 button
                              >
                                 <ListItemText
                                    id={labelId}
                                    primary={`N${nas.id}`}
                                    secondary={nas.patient.name}
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
                     })}
               </List>
            )}
         </Paper>
         {nas.metadata && nas.metadata.total > itemsPerPage && (
            <div className={classes.pagination}>
               <Pagination
                  count={Math.round(
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
      </Layout>
   )
}

export default Nas
