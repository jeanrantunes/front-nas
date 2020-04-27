import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
   CssBaseline,
   Grid,
   Avatar,
   Card,
   CardHeader,
   CardActions,
   CardContent,
   Typography,
   Button,
   Fab,
   IconButton,
   Menu,
   MenuItem,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   Slide,
   Popover,
   Radio,
   RadioGroup,
   FormControlLabel
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Add, MoreVert, Assignment, Ballot } from '@material-ui/icons'

import {
   requestPatients,
   addPatient,
   updatePatient,
   removePatient
} from '../../store/actions/patients'
import { age } from '../../helpers/date'
import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'
import AnimatedBadge from '../../components/AnimatedBadge'

const TransitionDialog = React.forwardRef(function Transition(props, ref) {
   return <Slide direction='up' ref={ref} {...props} />
})

const useStyles = makeStyles(theme => ({
   cardContent: {
      minHeight: 150
   },
   buttonsCard: {
      padding: theme.spacing(2),
      justifyContent: 'space-between'
   },
   fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2)
   },
   formOutcome: {
      padding: theme.spacing(2)
   },
   buttonOutcome: {
      marginTop: theme.spacing(1)
   }
}))

const MenuPatient = props => {
   const { patient, anchor, close, setDeleteDialog } = props

   function deletePatient() {
      close()
      setDeleteDialog(true)
   }

   return (
      <Menu
         id='simple-menu'
         anchorEl={anchor}
         elevation={1}
         keepMounted
         open={true}
         onClose={close}
      >
         <MenuItem component={Link} to={`/patient/${patient.id}`}>
            Editar dados
         </MenuItem>
         <MenuItem component={Link} to={`/nas?patientId=${patient.id}`}>
            Histórico NAS
         </MenuItem>
         <MenuItem onClick={deletePatient}>Excluir</MenuItem>
      </Menu>
   )
}

const PopoverPatient = props => {
   const { patient, close, anchor, classes, dispatch } = props
   const [outcome, setOutcome] = useState(null)
   const [show, setShow] = useState(true)

   function handleSubmitOutcome(event) {
      event.preventDefault()
      let comorbidities = [],
         hospitalizationReason = []
      if (patient.comorbidities) {
         comorbidities = patient.comorbidities.map(c => c.id)
      }
      if (patient.hospitalizationReason) {
         hospitalizationReason = patient.hospitalizationReason.map(h => h.id)
      }

      const outcomeDate = new Date()

      dispatch(
         updatePatient({
            ...patient,
            outcome,
            outcomeDate,
            comorbidities,
            hospitalizationReason
         })
      )
      setShow(false)
   }

   return (
      <Popover open={show} anchorEl={anchor} onClose={close}>
         <form className={classes.formOutcome} onSubmit={handleSubmitOutcome}>
            {patient.name}
            <RadioGroup
               aria-label='outcome'
               name='outcome'
               value={outcome}
               onChange={e => setOutcome(e.target.value)}
            >
               <FormControlLabel
                  value='discharge'
                  control={<Radio />}
                  label='Alta'
               />
               <FormControlLabel
                  value='death'
                  control={<Radio />}
                  label='Óbito'
               />
            </RadioGroup>
            <Button
               className={classes.buttonOutcome}
               type='submit'
               variant='outlined'
               color='primary'
            >
               Enviar
            </Button>
         </form>
      </Popover>
   )
}

const WarningDialog = props => {
   const { warningDialog, setWarningDialog } = props
   return (
      <Dialog
         open={warningDialog}
         TransitionComponent={TransitionDialog}
         keepMounted
         onClose={() => setWarningDialog(false)}
         aria-labelledby='alert-dialog-slide-title'
         aria-describedby='alert-dialog-slide-description'
      >
         <DialogTitle id='alert-dialog-slide-title'>
            {'Todos os leitos estão ocupados'}
         </DialogTitle>
         <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
               Todos os leitos estão ocupados no momento...
               <br />
               Dê um desfecho para o paciente que estava no leito vago.
            </DialogContentText>
         </DialogContent>
         <DialogActions>
            <Button onClick={() => setWarningDialog(false)} color='primary'>
               Ok
            </Button>
         </DialogActions>
      </Dialog>
   )
}

const DoesShowDot = ({ flag, children }) => {
   if (!flag) {
      return (
         <AnimatedBadge vertical='top' horizontal='left' color='warning'>
            {children}
         </AnimatedBadge>
      )
   }
   return children
}

const Beds = props => {
   const { data: patients } = useSelector(store => store.patients)
   const classes = useStyles()
   const dispatch = useDispatch()
   const [patient, setPatient] = useState(null)

   const [anchorEl, setAnchorEl] = useState(null)
   const [anchorPopover, setAnchorPopover] = useState(null)

   const [warningDialog, setWarningDialog] = useState(false)
   const [deleteDialog, setDeleteDialog] = useState(false)

   function handleClick(event, patient) {
      setPatient(null)
      setPatient(patient)
      setAnchorEl(event.currentTarget)
   }

   function handleClose() {
      setAnchorEl(null)
      setAnchorPopover(null)
   }

   function handleClickAddPatient() {
      if (patients.length >= 6) {
         setWarningDialog(true)
         return
      }
      props.history.push('/patient')
   }
   function handleClickOucome(event, patient) {
      setPatient(patient)
      setAnchorPopover(event.currentTarget)
   }

   useEffect(() => {
      dispatch(
         requestPatients({
            outcome: 'pending',
            orderBy: 'bed',
            itemsPerPage: 6,
            comorbidities: true,
            hospitalizationReason: true
         })
      )
   }, [dispatch])

   return (
      <Layout>
         <CssBaseline />
         {anchorEl && patient && (
            <MenuPatient
               anchor={anchorEl}
               patient={patient}
               close={handleClose}
               setDeleteDialog={setDeleteDialog}
            />
         )}
         {anchorPopover && patient && (
            <PopoverPatient
               anchor={anchorPopover}
               patient={patient}
               close={handleClose}
               classes={classes}
               dispatch={dispatch}
            />
         )}
         <Grid container component='main' spacing={2}>
            {patients ? (
               patients.map(patient => (
                  <React.Fragment key={patient.id}>
                     {patient.outcome === 'pending' && (
                        <Grid item xs={12} sm={6} md={4}>
                           <Card className={classes.card}>
                              <CardHeader
                                 avatar={
                                    <Avatar aria-label='recipe'>
                                       {patient.bed}
                                    </Avatar>
                                 }
                                 action={
                                    <IconButton
                                       aria-controls='simple-menu'
                                       aria-haspopup='true'
                                       onClick={e => handleClick(e, patient)}
                                    >
                                       <MoreVert />
                                    </IconButton>
                                 }
                                 title={patient.name}
                                 subheader={
                                    patient.birthday &&
                                    `${age(patient.birthday)} anos`
                                 }
                              />
                              <CardContent className={classes.cardContent}>
                                 {patient.comorbidities && (
                                    <Typography
                                       variant='body2'
                                       color='textSecondary'
                                       component='p'
                                    >
                                       {patient.comorbidities.length > 1 ? (
                                          <b>Comorbidades:</b>
                                       ) : (
                                          <b>Comorbidade:</b>
                                       )}{' '}
                                       {patient.comorbidities.map(
                                          (c, index) => (
                                             <span key={index}>
                                                {c.name}
                                                {index !==
                                                patient.comorbidities.length - 1
                                                   ? ', '
                                                   : '.'}
                                             </span>
                                          )
                                       )}
                                    </Typography>
                                 )}
                                 {patient.hospitalizationReason && (
                                    <Typography
                                       variant='body2'
                                       color='textSecondary'
                                       component='p'
                                    >
                                       {patient.hospitalizationReason.length >
                                       1 ? (
                                          <b>Motivos da internação:</b>
                                       ) : (
                                          <b>Motivo da internação:</b>
                                       )}{' '}
                                       {patient.hospitalizationReason.map(
                                          (h, index) => (
                                             <span key={index}>
                                                {h.name}
                                                {index !==
                                                patient.hospitalizationReason
                                                   .length -
                                                   1
                                                   ? ', '
                                                   : '.'}
                                             </span>
                                          )
                                       )}
                                    </Typography>
                                 )}
                              </CardContent>
                              <CardActions className={classes.buttonsCard}>
                                 <DoesShowDot flag={patient.dailyNas}>
                                    <Button
                                       variant='outlined'
                                       size='small'
                                       color='primary'
                                       startIcon={<Assignment />}
                                       to={`/nas/${patient.id}`}
                                       component={Link}
                                       disabled={patient.dailyNas}
                                    >
                                       Registrar NAS
                                    </Button>
                                 </DoesShowDot>

                                 <Button
                                    variant='outlined'
                                    size='small'
                                    color='primary'
                                    onClick={e => handleClickOucome(e, patient)}
                                    startIcon={<Ballot />}
                                 >
                                    Desfecho
                                 </Button>
                              </CardActions>
                           </Card>
                        </Grid>
                     )}
                  </React.Fragment>
               ))
            ) : (
               <Typography variant='h5' component='span'>
                  Não há pacientes cadastrados! Adicione um paciente clicando em
                  (+) no canto inferior direito.
               </Typography>
            )}
         </Grid>
         <Fab
            className={classes.fab}
            color='primary'
            aria-label='add'
            onClick={handleClickAddPatient}
         >
            <Add />
         </Fab>

         {warningDialog && (
            <WarningDialog
               warningDialog={warningDialog}
               setWarningDialog={setWarningDialog}
            />
         )}

         {deleteDialog && (
            <DeleteDialog
               title={'Tem certeza que deseja excluir o paciente?'}
               text={' Não será possível desfazer está ação...'}
               deleteDialog={deleteDialog}
               setDeleteDialog={setDeleteDialog}
               id={patient.id}
               funcRemove={removePatient}
            />
         )}
      </Layout>
   )
}

export default Beds
