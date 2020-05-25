import React, { useState, useEffect } from 'react'
import {
   FormControl,
   InputLabel,
   MenuItem,
   FormHelperText,
   Select
} from '@material-ui/core'
import { FastField } from 'formik'
// import { Select } from 'formik-material-ui'

import api from '../../services/api'

const CustomSelect = props => {
   const {
      id,
      endpoint,
      options,
      variant,
      classes,
      error,
      helperText,
      value,
      ...rest
   } = props
   const [data, setData] = useState(null)
   const [selected, setSelected] = useState(
      value ? value : rest.multiple ? [] : options[0].id
   )

   useEffect(() => {
      if (!endpoint && !options) {
         console.warn('You need pass an endpoint or options')
         return
      } else if (endpoint) {
         async function get() {
            try {
               const { data } = await api.get(endpoint)
               setData(data.data)
            } catch (error) {
               setData(null)
            }
         }
         get()
      }
      setData(options)
   }, [endpoint, options])

   return (
      <React.Fragment>
         {data && (
            <FormControl
               fullWidth
               variant={variant}
               className={classes}
               error={error}
               required={rest.required || false}
            >
               <InputLabel id={`${rest.id}-label`}>{rest.label}</InputLabel>
               <FastField
                  labelId={`${rest.id}-label`}
                  component={({ handleChange, field }) => {
                     return (
                        <Select
                           {...rest}
                           value={selected}
                           onChange={e => {
                              field.onChange(e)
                              handleChange(e)
                           }}
                           onBlur={e => {
                              field.onBlur(e)
                           }}
                        >
                           {data.map(d => (
                              <MenuItem key={d.id} value={d.id}>
                                 {d.name}
                              </MenuItem>
                           ))}
                        </Select>
                     )
                  }}
                  type='text'
                  handleChange={event => setSelected(event.target.value)}
               ></FastField>
               {error && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
         )}
      </React.Fragment>
   )
}

export default CustomSelect
