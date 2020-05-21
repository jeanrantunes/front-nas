import React, { useState, useEffect } from 'react'
import {
   TextField,
   Backdrop,
   Button,
   Card,
   CardContent,
   CardActions
} from '@material-ui/core'
import { DateRange } from 'react-date-range'
import { makeStyles } from '@material-ui/core/styles'
import pt from 'date-fns/locale/pt-BR'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import './style.css'

import { formatPTDate } from '../../helpers/date'

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
   setEndDate,
   inputRef,
   disabled
}) => {
   const classes = useStyles()
   const [preDate, setPreDate] = useState([null, null])
   const [inputValue, setInputValue] = useState('')
   const [show, setShow] = useState(false)
   const [range, setRange] = useState([
      {
         startDate: startDate ? new Date(startDate) : new Date(),
         endDate: endDate ? new Date(endDate) : new Date(),
         key: 'selection',
         color: '#3f51b5'
      }
   ])

   useEffect(() => {
      const start = formatPTDate(startDate)
      const end = formatPTDate(endDate)
      const today = formatPTDate()

      if (!startDate && !endDate) {
         if (inputRef) {
            inputRef.current.value = ''
         }
         setInputValue('')
         return
      }

      if (!startDate) {
         if (end === today) {
            setInputValue('Hoje')
            return
         }
         setInputValue(end)
         return
      }

      if (!endDate) {
         if (start === today) {
            setInputValue('Hoje')
            return
         }
         setInputValue(start)
         return
      }

      if (start === end) {
         if (start === today) {
            setInputValue('Hoje')
            return
         }
         setInputValue(start)
         return
      }

      if (end === today) {
         setInputValue(`${start} até hoje`)
         return
      }

      setInputValue(`${start} até ${end}`)
   }, [startDate, endDate, inputRef])

   function open(e) {
      if (disabled) {
         return
      }
      e.preventDefault()
      e.target.blur()
      setShow(true)
   }

   function confirmRange() {
      setStartDate(preDate[0])
      setEndDate(preDate[1])
      setShow(false)
   }

   function setDate(item) {
      setRange([item.selection])

      const { startDate, endDate } = item.selection

      if (!startDate || !endDate) {
         return
      }

      const start = new Date(startDate).toDateString()
      const end = new Date(endDate).toDateString()
      const today = new Date().toDateString()

      if (start === end) {
         if (start === today) {
            setPreDate([today, null])
            return
         }
         setPreDate([start, null])
         return
      }
      setPreDate([start, end])
   }

   return (
      <div className={classes.root}>
         <TextField
            id={id || 'id-input-date'}
            label={label || 'Label'}
            variant={variant || 'outlined'}
            onClick={open}
            value={inputValue}
            inputRef={inputRef}
            disabled={disabled}
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
