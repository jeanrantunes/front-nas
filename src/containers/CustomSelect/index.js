import React, { useState, useEffect } from 'react'
import { FormControl, InputLabel, MenuItem } from '@material-ui/core'
import { Field } from 'formik'
import { Select, TextField } from 'formik-material-ui'

import api from '../../services/api'

const CustomSelect = props => {
   const {
      id,
      endpoint,
      options,
      name,
      label,
      variant,
      classes,
      multiple
   } = props
   const [data, setData] = useState(null)

   useEffect(() => {
      if (!endpoint && !options) {
         console.warn('You need pass an endpoint or options')
         return
      } else if (endpoint) {
         async function get() {
            try {
               const { data } = await api.get(endpoint)
               setData(data)
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
            <FormControl fullWidth variant={variant} className={classes}>
               <InputLabel id={`${id}-label`}>{label}</InputLabel>
               <Field
                  id={id}
                  labelId={`${id}-label`}
                  component={Select}
                  type='text'
                  multiple={multiple}
                  name={name}
                  label={label}
               >
                  {data.map(d => (
                     <MenuItem key={d.id} value={d.id}>
                        {d.name}
                     </MenuItem>
                  ))}
               </Field>
            </FormControl>
         )}
      </React.Fragment>
   )
}

export default CustomSelect
