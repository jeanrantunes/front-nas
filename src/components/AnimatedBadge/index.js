import React from 'react'
import { Badge } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const AnimatedBadge = ({
   children,
   overlap,
   vertical,
   horizontal,
   color,
   className
}) => {
   const StyledBadge = withStyles(theme => {
      if (!color) {
         color = 'primary'
      }

      return {
         badge: {
            backgroundColor: color,
            color: color,
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            width: 10,
            height: 10,
            borderRadius: '50%',
            '&::after': {
               position: 'absolute',
               top: overlap === 'circle' ? -1 : 0,
               left: overlap === 'circle' ? -1 : 0,
               width: '100%',
               height: '100%',
               borderRadius: '50%',
               animation: '$ripple 1.2s infinite ease-in-out',
               border: '1px solid currentColor',
               content: '""'
            }
         },
         '@keyframes ripple': {
            '0%': {
               transform: 'scale(.8)',
               opacity: 1
            },
            '100%': {
               transform: 'scale(1.4)',
               opacity: 0
            }
         }
      }
   })(Badge)

   return (
      <StyledBadge
         className={className}
         overlap={overlap}
         anchorOrigin={{
            vertical,
            horizontal
         }}
         variant='dot'
      >
         {children}
      </StyledBadge>
   )
}

export default AnimatedBadge
