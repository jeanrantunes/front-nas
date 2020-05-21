import React, { useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
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
   useMediaQuery
} from '@material-ui/core'
import {
   AirlineSeatIndividualSuite,
   Group,
   List as ListIcon,
   Menu,
   Settings,
   SupervisedUserCircle,
   ExitToApp
} from '@material-ui/icons'

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
   }
}))

function ListItemLink(props) {
   return <ListItem button component='a' {...props} />
}

const Layout = props => {
   const theme = useTheme()
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

   const classes = stylesLayout()
   const [open, setOpen] = React.useState(false)
   const { logout } = useAuth()
   const { user } = useUser()
   // console.log(props)
   useEffect(() => {
      // console.log(isMobile)
      if (isMobile) {
         setOpen(false)
         return
      }
      setOpen(true)
   }, [isMobile])

   const handleDrawerOpen = () => {
      setOpen(!open)
   }

   return (
      <div className={classes.root}>
         <CssBaseline />
         <AppBar position='fixed' className={classes.appBar}>
            <Toolbar>
               <IconButton
                  color='inherit'
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
               <ListItem className={classes.links} component={Link} to='/'>
                  <ListItemIcon>
                     <AirlineSeatIndividualSuite />
                  </ListItemIcon>
                  <ListItemText primary={'Leitos'} />
               </ListItem>
               <ListItemLink
                  className={classes.links}
                  component={Link}
                  to='/patients'
               >
                  <ListItemIcon>
                     <Group />
                  </ListItemIcon>
                  <ListItemText primary={'Pacientes'} />
               </ListItemLink>
               <ListItemLink
                  className={classes.links}
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
                        className={classes.links}
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
                        className={classes.links}
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
         </Drawer>
         <main
            // maxWidth='lg'
            className={clsx(classes.content, {
               [classes.contentShift]: open
            })}
         >
            <Container maxWidth='lg' disableGutters={isMobile}>
               <div className={classes.toolbar} />
               <Box mt={2}>{props.children}</Box>
            </Container>
         </main>
      </div>
   )
}

export default Layout
