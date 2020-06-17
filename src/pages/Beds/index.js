import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
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
   FormControlLabel,
   useMediaQuery
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { red, orange, cyan, lime } from '@material-ui/core/colors'
import { Add, MoreVert, Assignment, Ballot, Cake } from '@material-ui/icons'
import Skeleton from '@material-ui/lab/Skeleton'
import {
   requestPatients,
   updatePatient,
   removePatient
} from '../../store/actions/patients'

import { enableSteps, enableButtonHelp } from '../../store/actions/stepByStep'

import { age, isItBirthday } from '../../helpers/date'
import Layout from '../../Layouts/dashboard'
import DeleteDialog from '../../containers/DialogDeletePatient'

import AnimatedBadge from '../../components/AnimatedBadge'
import { dailyAveragePatientsNas } from '../../utils/nas-func'

const TransitionDialog = React.forwardRef(function Transition(props, ref) {
   return <Slide direction='up' ref={ref} {...props} />
})

const useStyles = makeStyles(theme => ({
   cardPatient: {},
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
   },
   cardActions: {
      display: 'flex',
      alignItems: 'center'
   },
   scaleBadge: {
      width: 17
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
         <MenuItem component={Link} to={`/nas?patient_id=${patient.id}`}>
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
         hr = []
      if (patient.comorbidities) {
         comorbidities = patient.comorbidities.map(c => c.id)
      }
      if (patient.hr) {
         hr = patient.hr.map(h => h.id)
      }

      const outcome_date = new Date()
      delete patient.nas
      delete patient.average
      delete patient.latest_nas
      dispatch(
         updatePatient({
            ...patient,
            outcome,
            outcome_date,
            comorbidities,
            hr
         })
      )
      setShow(false)
   }

   return (
      <Popover open={show} anchorEl={anchor} onClose={close}>
         <form className={classes.formOutcome} onSubmit={handleSubmitOutcome}>
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

const SkeletonCards = () => {
   const classes = useStyles()
   const array = []
   for (let i = 0; i < 6; i++) {
      array.push(
         <Grid key={i} item xs={12} md={6} lg={4}>
            <Card>
               <CardHeader
                  avatar={
                     <Skeleton
                        animation='wave'
                        variant='circle'
                        width={40}
                        height={40}
                     />
                  }
                  title={
                     <Skeleton
                        animation='wave'
                        height={20}
                        width='60%'
                        style={{ marginBottom: 6 }}
                     />
                  }
                  subheader={
                     <Skeleton
                        animation='wave'
                        height={20}
                        width='30%'
                        style={{ marginBottom: 6 }}
                     />
                  }
               />
               <CardContent className={classes.cardContent}>
                  <Skeleton
                     animation='wave'
                     height={20}
                     width='20%'
                     style={{ marginBottom: 3 }}
                  />
                  <Skeleton
                     animation='wave'
                     height={20}
                     width='100%'
                     style={{ marginBottom: 3 }}
                  />
                  <Skeleton
                     animation='wave'
                     height={20}
                     width='100%'
                     style={{ marginBottom: 3 }}
                  />
               </CardContent>
               <CardActions className={classes.buttonsCard}>
                  <Skeleton animation='wave' height={35} width={155} />
                  <Skeleton animation='wave' height={35} width={120} />
               </CardActions>
            </Card>
         </Grid>
      )
   }
   return <React.Fragment>{array}</React.Fragment>
}

const DoesShowDot = ({ flag, children }) => {
   if (!flag) {
      return (
         <AnimatedBadge vertical='top' horizontal='left' color={lime[500]}>
            {children}
         </AnimatedBadge>
      )
   }
   return children
}

const Beds = props => {
   const patients = useSelector(store => store.patients)
   const classes = useStyles()
   const dispatch = useDispatch()
   const [patient, setPatient] = useState(null)
   const theme = useTheme()
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
      if (patients.data.length >= 6) {
         setWarningDialog(true)
         return
      }
      props.history.push('/patient')
   }
   function handleClickOucome(event, patient) {
      setPatient(patient)
      setAnchorPopover(event.currentTarget)
   }

   function hasNas() {
      return patients.data.find(patient => {
         if (patient.latest_nas) {
            return patient
         }
         return null
      })
   }

   useEffect(() => {
      dispatch(
         requestPatients({
            outcome: 'pending',
            order_by: 'bed',
            items_per_page: 6,
            comorbidities: true,
            hr: true,
            latest_nas: true
         })
      )
   }, [dispatch])

   useEffect(() => {
      if (!patients.loading && !!patients.data.length) {
         dispatch(enableSteps())
         dispatch(enableButtonHelp())
      }
   }, [patients.loading, patients.data, dispatch])

   return (
      <Layout
         {...props}
         steps={[
            {
               element: '.beds-link',
               intro: 'Todos os 6 pacientes internados na UTI'
            },
            {
               element: '.average-nas',
               intro: 'Média dos últimos 6 NAS cadastrados'
            },
            {
               element: '.gavidity-1',
               intro: 'Indica o paciente mais grave'
            },

            {
               element: '.gavidity-2',
               intro: 'Indica o segundo paciente mais grave'
            },
            {
               element: '.gavidity-3',
               intro: 'Indica o terceiro paciente mais grave'
            },
            {
               element: '.register-nas',
               intro:
                  'Indica que não foi cadastrado o NAS diário. Esse indicador aparece no botão Cadastrar NAS'
            },
            {
               element: '.add-patient',
               intro: 'Adicionar o paciente a UTI'
            },
            {
               element: '.card-patient',
               intro: 'Representa o paciente internado'
            },
            {
               element: '.bed',
               intro: 'Leito do paciente'
            },
            {
               element: '.options-patient',
               intro:
                  'Contém configurações do paciente: Editar dados, Histórico NAS e Excluir'
            },
            {
               element: '.content-patient',
               intro: 'Informações do paciente'
            },
            {
               element: '.nas-button',
               intro: 'Cadastrar o NAS diário'
            },
            {
               element: '.outcome-button',
               intro: 'Dar um desfecho para o paciente: alta ou óbito'
            },
            {
               element: '.exit-button',
               intro: 'Sair do sistema'
            }
         ]}
      >
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
            {patients.loading ? (
               <React.Fragment>
                  <Grid item xs={12}>
                     <Skeleton
                        animation='wave'
                        variant='rect'
                        height={32}
                        className={classes.card}
                     />
                  </Grid>

                  <SkeletonCards />
               </React.Fragment>
            ) : !patients.loading && !!patients.data.length ? (
               <React.Fragment>
                  {/* <StepByStep
                     steps={[
                        
                        {
                           element: '.average-nas',
                           intro: 'Média dos últimos 6 NAS'
                        },
                        {
                           element: '.gavidity-1',
                           intro: 'Indica o paciente mais grave'
                        },

                        {
                           element: '.gavidity-2',
                           intro: 'Indica o segundo paciente mais grave'
                        },
                        {
                           element: '.gavidity-3',
                           intro: 'Indica o terceiro paciente mais grave'
                        },
                        {
                           element: '.register-nas',
                           intro: 'Indica que não foi cadastrado o NAS de hoje'
                        },
                        {
                           element: '.add-patient',
                           intro: 'Adicionar um paciente'
                        },
                        {
                           element: '.card-patient',
                           intro: 'Representa um paciente internado'
                        },
                        {
                           element: '.bed',
                           intro: 'Leito do paciente'
                        },
                        {
                           element: '.options-patient',
                           intro:
                              'Contém configurações do paciente: Editar dados, Histórico NAS e Excluir'
                        },
                        {
                           element: '.content-patient',
                           intro: 'Informações sobre o paciente'
                        },
                        {
                           element: '.nas-button',
                           intro: 'Cadastrar o NAS do dia'
                        },
                        {
                           element: '.outcome-button',
                           intro:
                              'Dar um desfecho para o paciente: alta ou óbito'
                        }
                     ]}
                  /> */}
                  <Grid item xs={12} sm={6}>
                     {hasNas(patients.data) && (
                        <Typography variant='h5' gutterBottom>
                           <span className='average-nas'>
                              Média diária:{' '}
                              {dailyAveragePatientsNas(patients.data).toFixed(
                                 1
                              )}
                           </span>
                        </Typography>
                     )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                     <Typography
                        align='right'
                        variant='body2'
                        gutterBottom
                        className='gravity-info'
                     >
                        Escala de gravidade:{' '}
                        <AnimatedBadge
                           className={`${classes.scaleBadge} gavidity-1`}
                           vertical='bottom'
                           horizontal='right'
                           color={red[500]}
                        >
                           {' '}
                        </AnimatedBadge>
                        <AnimatedBadge
                           className={`${classes.scaleBadge} gavidity-2`}
                           vertical='bottom'
                           horizontal='right'
                           color={orange[600]}
                        >
                           {' '}
                        </AnimatedBadge>
                        <AnimatedBadge
                           className={`${classes.scaleBadge} gavidity-3`}
                           vertical='bottom'
                           horizontal='right'
                           color={cyan[500]}
                        >
                           {' '}
                        </AnimatedBadge>
                     </Typography>
                     <Typography align='right' variant='body2' gutterBottom>
                        Cadastrar NAS diário:{' '}
                        <AnimatedBadge
                           className={`${classes.scaleBadge} register-nas`}
                           vertical='bottom'
                           horizontal='right'
                           color={lime[500]}
                        >
                           {' '}
                        </AnimatedBadge>
                     </Typography>
                  </Grid>
                  {patients.data.map(patient => (
                     <React.Fragment key={patient.id}>
                        {patient.outcome === 'pending' && (
                           <Grid item xs={12} md={6} lg={4}>
                              <Card className='card-patient'>
                                 <CardHeader
                                    avatar={
                                       <React.Fragment>
                                          <Avatar
                                             aria-label='recipe'
                                             className='bed'
                                          >
                                             {patient.bed}
                                          </Avatar>
                                       </React.Fragment>
                                    }
                                    action={
                                       <div className={classes.cardActions}>
                                          {isItBirthday(patient.birthday) && (
                                             <Cake color='secondary' />
                                          )}
                                          <IconButton
                                             className='options-patient'
                                             aria-controls='simple-menu'
                                             aria-haspopup='true'
                                             onClick={e =>
                                                handleClick(e, patient)
                                             }
                                          >
                                             <MoreVert />
                                          </IconButton>
                                       </div>
                                    }
                                    title={patient.name}
                                    subheader={
                                       patient.birthday &&
                                       `${age(patient.birthday)} anos`
                                    }
                                 />
                                 <CardContent
                                    className={`${classes.cardContent} content-patient`}
                                 >
                                    {patient.average > 0 && (
                                       <Typography
                                          variant='body2'
                                          color='textSecondary'
                                          component='p'
                                          style={{
                                             color:
                                                patient.color ||
                                                'rgba(0, 0, 0, 0.54)'
                                          }}
                                       >
                                          <b>NAS:</b>{' '}
                                          {patient.average.toFixed(1)}
                                          <br />
                                       </Typography>
                                    )}
                                    {patient.origin && (
                                       <Typography
                                          variant='body2'
                                          color='textSecondary'
                                          component='p'
                                       >
                                          <b>Procedência:</b>{' '}
                                          {(function () {
                                             switch (patient.origin) {
                                                case 'ps':
                                                   return 'Pronto Socorro (PS)'
                                                case 'nursery':
                                                   return 'Enfermaria'
                                                case 'surgical-ward':
                                                   return 'Bloco Cirúrgico'
                                                case 'other-institution':
                                                   return 'Outra instituição'
                                                case 'uti-covid':
                                                   return 'UTI Covid'
                                                case 'home':
                                                   return 'Casa'
                                                default:
                                                   break
                                             }
                                          })()}
                                          <br />
                                       </Typography>
                                    )}
                                    {patient.comorbidities &&
                                       !!patient.comorbidities.length && (
                                          <Typography
                                             variant='body2'
                                             color='textSecondary'
                                             component='p'
                                          >
                                             {patient.comorbidities.length >
                                             1 ? (
                                                <b>Comorbidades:</b>
                                             ) : (
                                                <b>Comorbidade:</b>
                                             )}{' '}
                                             {patient.comorbidities.map(
                                                (c, index) => (
                                                   <span key={index}>
                                                      {c.name}
                                                      {index !==
                                                      patient.comorbidities
                                                         .length -
                                                         1
                                                         ? ', '
                                                         : '.'}
                                                   </span>
                                                )
                                             )}
                                          </Typography>
                                       )}
                                    {patient.hr && !!patient.hr.length && (
                                       <Typography
                                          variant='body2'
                                          color='textSecondary'
                                          component='p'
                                       >
                                          {patient.hr.length > 1 ? (
                                             <b>Motivos da internação:</b>
                                          ) : (
                                             <b>Motivo da internação:</b>
                                          )}{' '}
                                          {patient.hr.map((h, index) => (
                                             <span key={index}>
                                                {h.name}
                                                {index !== patient.hr.length - 1
                                                   ? ', '
                                                   : '.'}
                                             </span>
                                          ))}
                                       </Typography>
                                    )}
                                 </CardContent>
                                 <CardActions className={classes.buttonsCard}>
                                    <DoesShowDot flag={patient.daily_nas}>
                                       <Button
                                          variant='outlined'
                                          size='small'
                                          color='primary'
                                          startIcon={<Assignment />}
                                          to={`/nas/${patient.id}`}
                                          component={Link}
                                          className='nas-button'
                                          disabled={patient.daily_nas}
                                       >
                                          {isMobile
                                             ? 'Reg. NAS'
                                             : 'Registrar NAS'}
                                       </Button>
                                    </DoesShowDot>

                                    <Button
                                       variant='outlined'
                                       size='small'
                                       color='primary'
                                       className='outcome-button'
                                       onClick={e =>
                                          handleClickOucome(e, patient)
                                       }
                                       startIcon={<Ballot />}
                                    >
                                       Desfecho
                                    </Button>
                                 </CardActions>
                              </Card>
                           </Grid>
                        )}
                     </React.Fragment>
                  ))}
               </React.Fragment>
            ) : (
               <Typography variant='h5' component='span'>
                  Não há pacientes cadastrados! Adicione um paciente clicando em
                  (+) no canto inferior direito.
               </Typography>
            )}
         </Grid>

         <Fab
            className={`${classes.fab} add-patient`}
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
