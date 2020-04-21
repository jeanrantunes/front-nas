import React, { useState, createRef } from 'react'
import {
   TextField,
   Backdrop,
   Button,
   Card,
   CardContent,
   CardActions
} from '@material-ui/core'
import { DateRange } from 'react-date-range'
import pt from 'date-fns/locale/pt-BR'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import './style.css'
import { makeStyles, withStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
   daterangeContainer: {
      width: 310
   },
   daterange: {
      padding: 0
   },
   actions: {
      float: 'right'
   },
   backdrop: {
      zIndex: theme.zIndex.drawer + 100
   }
}))

const MaterialDateRange = ({
   label,
   id,
   variant,
   startDate,
   endDate,
   maxDate,
   setStartDate,
   setEndDate
}) => {
   const classes = useStyles()
   const [preValue, setPreValue] = useState('')
   const [preDate, setPreDate] = useState([null, null])
   const [inputValue, setInputValue] = useState('')
   const [show, setShow] = useState(false)
   const [range, setRange] = useState([
      {
         startDate: startDate || new Date(),
         endDate: endDate || new Date(),
         key: 'selection',
         color: '#3f51b5'
      }
   ])
   const options = { year: '2-digit', month: 'short', day: 'numeric' }

   function open(e) {
      setPreDate([new Date(), new Date()])
      setPreValue('Hoje')
      e.preventDefault()
      e.target.blur()
      setShow(true)
   }

   function confirmRange() {
      setStartDate(preDate[0])
      setEndDate(preDate[1])
      setInputValue(preValue)
      setShow(false)
   }

   function setDate(item) {
      setRange([item.selection])

      const { startDate, endDate } = item.selection

      if (!startDate || !endDate) {
         return
      }

      const start = new Date(startDate).toLocaleDateString('pt-br', options)
      const end = new Date(endDate).toLocaleDateString('pt-br', options)

      if (start === end) {
         setPreDate([new Date(startDate), new Date()])
         setPreValue(`${start} até hoje`)
         return
      }
      setPreDate([new Date(startDate), new Date(endDate)])
      setPreValue(`${start} até ${end}`)
   }

   return (
      <div className={classes.root}>
         <TextField
            id={id || 'id-input-date'}
            label={label || 'Label'}
            variant={variant || 'outlined'}
            onClick={open}
            value={inputValue}
            fullWidth
         />
         <Backdrop className={classes.backdrop} open={show}>
            <Card className={classes.daterangeContainer}>
               <CardContent className={classes.daterange}>
                  <DateRange
                     ranges={range}
                     editableDateInputs={true}
                     months={1}
                     onChange={setDate}
                     locale={pt}
                     direction='horizontal'
                     maxDate={maxDate || new Date()}
                  />
               </CardContent>
               <CardActions className={classes.actions}>
                  <Button color='primary' onClick={() => setShow(false)}>
                     Cancelar
                  </Button>
                  <Button color='primary' onClick={confirmRange}>
                     Ok
                  </Button>
               </CardActions>
            </Card>
         </Backdrop>
      </div>
   )
}

export default MaterialDateRange
