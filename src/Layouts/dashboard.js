import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import {
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
   Avatar
} from '@material-ui/core'

import { MoveToInbox, Mail, Menu, ExitToApp } from '@material-ui/icons'
import { deepPurple } from '@material-ui/core/colors'

import { useAuth } from '../context/auth'
import { useUser } from '../context/user'

const drawerWidth = 240

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
   content: {
      flexGrow: 1,
      padding: theme.spacing(3)
   },
   toolbar: theme.mixins.toolbar,
   content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen
      }),
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
   const classes = stylesLayout()
   const [open, setOpen] = React.useState(true)
   const { logout } = useAuth()
   const { user } = useUser()

   const handleDrawerOpen = () => {
      setOpen(!open)
   }

   const handleDrawerClose = () => {
      setOpen(false)
   }

   return (
      <div className={classes.root}>
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
            variant='persistent'
            anchor='left'
            open={open}
            classes={{
               paper: classes.drawerPaper
            }}
         >
            <div className={classes.toolbar} />
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
                     <Mail />
                  </ListItemIcon>
                  <ListItemText primary={'Leitos'} />
               </ListItem>
               <ListItemLink
                  className={classes.links}
                  component={Link}
                  to='/patients'
               >
                  <ListItemIcon>
                     <Mail />
                  </ListItemIcon>
                  <ListItemText primary={'Pacientes'} />
               </ListItemLink>
            </List>
         </Drawer>
         <Toolbar />
         <main
            // maxWidth='lg'
            className={clsx(classes.content, {
               [classes.contentShift]: open
            })}
         >
            <Container maxWidth='lg'>
               <div className={classes.toolbar} />
               <Box mt={2}>{props.children}</Box>
            </Container>
         </main>
      </div>
   )
}

export default Layout
