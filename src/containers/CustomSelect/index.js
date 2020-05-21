import React, { useState, useEffect } from 'react'
import {
   FormControl,
   InputLabel,
   MenuItem,
   FormHelperText
} from '@material-ui/core'
import { Field } from 'formik'
import { Select } from 'formik-material-ui'

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
      ...rest
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
               <Field
                  {...rest}
                  labelId={`${rest.id}-label`}
                  component={Select}
                  type='text'
               >
                  {data.map(d => (
                     <MenuItem key={d.id} value={d.id}>
                        {d.name}
                     </MenuItem>
                  ))}
               </Field>
               {error && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
         )}
      </React.Fragment>
   )
}

export default CustomSelect
