import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { getFirstTime, clearFirstTime } from '../helpers/token'

import { Link } from 'react-router-dom'
import {
   CssBaseline,
   AppBar,
   Toolbar,
   Typography,
   Drawer,
   List,
   ListItem,
   ListItemAvatar,
   ListItemIcon,
   ListItemText,
   Container,
   Box,
   Divider,
   IconButton,
   Avatar,
   Fab,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogContentText,
   DialogActions,
   Button,
   Slide,
   useMediaQuery
} from '@material-ui/core'
import {
   AirlineSeatIndividualSuite,
   Group,
   List as ListIcon,
   Menu,
   Settings,
   SupervisedUserCircle,
   ExitToApp,
   Help
} from '@material-ui/icons'
import { Steps } from 'intro.js-react'
import './tooltipHelp.css'
import {
   enableSteps,
   disableSteps,
   disableButtonHelp
} from '../store/actions/stepByStep'

import { deepPurple } from '@material-ui/core/colors'

import { useAuth } from '../context/auth'
import { useUser } from '../context/user'

const drawerWidth = 250

const stylesLayout = makeStyles(theme => ({
   root: {
      display: 'flex'
   },
   appBar: {
      zIndex: theme.zIndex.drawer + 100
   },
   title: {
      marginLeft: theme.spacing(1)
   },
   grow: {
      flexGrow: 1
   },
   hide: {
      display: 'none'
   },
   drawer: {
      width: drawerWidth,
      flexShrink: 0
   },
   drawerPaper: {
      width: drawerWidth
   },
   toolbar: theme.mixins.toolbar,
   content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen
      }),
      [theme.breakpoints.down('sm')]: {
         marginLeft: 0
      },
      marginLeft: -drawerWidth
   },
   contentShift: {
      transition: theme.transitions.create('margin', {
         easing: theme.transitions.easing.easeOut,
         duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
   },
   purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500]
   },
   avatar: {
      marginBottom: theme.spacing(1)
   },
   links: {
      paddingTop: 10,
      paddingBottom: 10
   },
   help: {
      left: 16,
      bottom: 16,
      position: 'fixed'
   }
}))

function ListItemLink(props) {
   return <ListItem button component='a' {...props} />
}

const Transition = React.forwardRef(function Transition(props, ref) {
   return <Slide direction='up' ref={ref} {...props} />
})

const Layout = props => {
   const theme = useTheme()
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
   const steps = useSelector(store => store.steps)

   const dispatch = useDispatch()
   const classes = stylesLayout()
   const [open, setOpen] = useState(false)
   const [openModalSteps, setOpenModalSteps] = useState(!!getFirstTime())
   const [activeSteps, setActiveSteps] = useState(false)

   const { logout } = useAuth()
   const { user } = useUser()

   useEffect(() => {
      if (isMobile) {
         setOpen(false)
         dispatch(disableButtonHelp())
         setOpenModalSteps(false)
         dispatch(disableSteps())
         return
      }

      setOpen(true)
   }, [isMobile, dispatch])

   useEffect(() => {
      if (getFirstTime()) {
         dispatch(enableSteps())
      }
   }, [dispatch])

   useEffect(() => {
      if (props.match.url !== '/' && getFirstTime() && !isMobile) {
         setOpenModalSteps(false)
         setActiveSteps(true)
      }
   }, [props.match.url, isMobile])

   const handleDrawerOpen = () => {
      setOpen(!open)
   }

   const onActiveStepsByFirstTime = () => {
      setActiveSteps(true)
      setOpenModalSteps(false)
   }

   const handleCloseModalSteps = () => {
      setOpenModalSteps(false)
      clearFirstTime()
      dispatch(disableSteps())
   }
   return (
      <div className={classes.root}>
         <CssBaseline />
         {props.steps && steps.stepsEnabled && steps.buttonHelp && (
            <Steps
               enabled={activeSteps}
               steps={props.steps.filter(s => s)}
               initialStep={steps.initialStep}
               options={{
                  prevLabel: 'Anterior',
                  nextLabel: 'Próximo',
                  skipLabel: 'Sair',
                  doneLabel: getFirstTime() ? 'Próximo' : 'Fechar',
                  showStepNumbers: false,
                  hidePrev: true,
                  hideNext: true,
                  tooltipClass: 'tooltip-help',
                  showProgress: true,
                  scrollToElement: false,
                  disableInteraction: true
               }}
               onComplete={() => {
                  dispatch(disableSteps())

                  if (!getFirstTime()) {
                     return
                  }

                  switch (props.match.url) {
                     case '/':
                        props.history.push('/patients')
                        break
                     case '/patients':
                        props.history.push('/nas')
                        break
                     case '/nas':
                        if (user.role === 'USER') {
                           clearFirstTime()
                           dispatch(disableSteps())
                           props.history.push('/')
                           break
                        }
                        props.history.push('/invite-users')
                        break
                     case '/invite-users':
                        props.history.push('/cms')
                        break
                     case '/cms':
                        clearFirstTime()
                        dispatch(disableSteps())
                        props.history.push('/')
                        break
                     default:
                        dispatch(disableSteps())
                        break
                  }
               }}
               onExit={stepIndex => {
                  dispatch(disableSteps())
               }}
               onBeforeExit={stepIndex => {
                  dispatch(disableSteps())
                  if (isNaN(stepIndex)) {
                     return
                  }

                  if (stepIndex < props.steps.length - 1) {
                     clearFirstTime()
                  }
               }}
            />
         )}
         <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
               <IconButton
                  color='inherit'
                  className='menu-button'
                  aria-label='abrir menu'
                  edge='start'
                  onClick={handleDrawerOpen}
               >
                  <Menu />
               </IconButton>
               <Typography variant='h6' className={classes.title}>
                  NAS
               </Typography>
               <div className={classes.grow} />
               <IconButton
                  color='inherit'
                  className='exit-button'
                  aria-label='sair'
                  edge='start'
                  onClick={logout}
               >
                  <ExitToApp />
               </IconButton>
            </Toolbar>
         </AppBar>
         <Drawer
            className={classes.drawer}
            variant={!isMobile ? 'persistent' : 'temporary'}
            anchor='left'
            open={open}
            onClose={() => setOpen(false)}
            classes={{
               paper: classes.drawerPaper
            }}
         >
            {!isMobile && <div className={classes.toolbar} />}

            <List>
               <ListItem className={classes.avatar}>
                  <ListItemAvatar>
                     <Avatar className={classes.purple}>{user.name[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
               </ListItem>
               <Divider />
               <ListItem
                  className={`${classes.links} beds-link`}
                  component={Link}
                  to='/'
               >
                  <ListItemIcon>
                     <AirlineSeatIndividualSuite />
                  </ListItemIcon>
                  <ListItemText primary={'Leitos'} />
               </ListItem>
               <ListItemLink
                  className={`${classes.links} patients-link`}
                  component={Link}
                  to='/patients'
               >
                  <ListItemIcon>
                     <Group />
                  </ListItemIcon>
                  <ListItemText primary={'Pacientes'} />
               </ListItemLink>
               <ListItemLink
                  className={`${classes.links} nas-link`}
                  component={Link}
                  to={{
                     pathname: '/nas',
                     state: { resetFilter: true }
                  }}
               >
                  <ListItemIcon>
                     <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary={'NAS'} />
               </ListItemLink>
               {user.role === 'ADMIN' && (
                  <React.Fragment>
                     <ListItemLink
                        className={`${classes.links} add-user-link`}
                        component={Link}
                        to={{
                           pathname: '/invite-users'
                        }}
                     >
                        <ListItemIcon>
                           <SupervisedUserCircle />
                        </ListItemIcon>
                        <ListItemText primary={'Adicionar usuários'} />
                     </ListItemLink>
                     <ListItemLink
                        className={`${classes.links} management-link`}
                        component={Link}
                        to={{
                           pathname: '/cms'
                        }}
                     >
                        <ListItemIcon>
                           <Settings />
                        </ListItemIcon>
                        <ListItemText primary={'Gerenciar conteúdo'} />
                     </ListItemLink>
                  </React.Fragment>
               )}
            </List>
            {steps.buttonHelp && !isMobile && (
               <Fab
                  className={`${classes.help} help-button`}
                  color='secondary'
                  aria-label='edit'
                  onClick={() => {
                     dispatch(enableSteps())
                     setActiveSteps(true)
                  }}
               >
                  <Help />
               </Fab>
            )}
         </Drawer>
         <main
            className={clsx(classes.content, {
               [classes.contentShift]: open
            })}
         >
            <Container maxWidth='lg' disableGutters={isMobile}>
               <div className={classes.toolbar} />
               <Dialog
                  open={openModalSteps}
                  onClose={handleCloseModalSteps}
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'
                  TransitionComponent={Transition}
               >
                  <DialogTitle id='alert-dialog-title'>
                     {'TOUR pelo NAS'}
                  </DialogTitle>
                  <DialogContent>
                     <DialogContentText id='alert-dialog-description'>
                        Notei que é sua primeira vez por aqui...
                        <br />
                        Deseja fazer um tour pelo sistema para conhecer melhor
                        suas funcionalidades?
                     </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                     <Button onClick={handleCloseModalSteps} color='primary'>
                        Não
                     </Button>
                     <Button
                        onClick={onActiveStepsByFirstTime}
                        color='primary'
                        autoFocus
                     >
                        Sim
                     </Button>
                  </DialogActions>
               </Dialog>
               <Box mt={2}>{props.children}</Box>
            </Container>
         </main>
      </div>
   )
}

export default Layout
