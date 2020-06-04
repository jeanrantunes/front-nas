import React, { useState, useEffect } from 'react'
import {
   FormControl,
   InputLabel,
   MenuItem,
   FormHelperText,
   Select,
   Checkbox,
   ListItemText,
   TextField
} from '@material-ui/core'
import { FastField } from 'formik'
import { Autocomplete } from '@material-ui/lab'

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
      autocompleteselect,
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
               if (rest.multiple && autocompleteselect) {
                  const sel = value.map(v => data.data.find(d => d.id === v))
                  setSelected(sel)
               }
               setData(data.data)
            } catch (error) {
               setData(null)
            }
         }
         get()
      }
      setData(options)
   }, [endpoint, options, autocompleteselect, rest.multiple, value])

   return (
      <React.Fragment>
         {data && (
            <React.Fragment>
               {autocompleteselect ? (
                  <FormControl
                     fullWidth
                     variant={variant}
                     className={classes}
                     error={error}
                     required={rest.required || false}
                  >
                     <FastField
                        labelId={`${id}-label`}
                        component={({ handleChange, field }) => {
                           return (
                              <Autocomplete
                                 {...rest}
                                 id={id}
                                 defaultValue={selected}
                                 options={data}
                                 onChange={(e, newValue) => {
                                    field.onChange(e)
                                    handleChange(newValue)
                                 }}
                                 onBlur={e => {
                                    field.onBlur(e)
                                 }}
                                 disableCloseOnSelect
                                 getOptionLabel={option => option.name}
                                 renderOption={(option, { selected }) => {
                                    if (rest.multiple) {
                                       return (
                                          <React.Fragment>
                                             <Checkbox checked={selected} />
                                             <ListItemText
                                                primary={option.name}
                                             />
                                          </React.Fragment>
                                       )
                                    }

                                    return option.name
                                 }}
                                 renderInput={params => (
                                    <TextField
                                       {...params}
                                       variant='outlined'
                                       label={rest.label}
                                       placeholder={rest.placeholder}
                                    />
                                 )}
                              />
                           )
                        }}
                        type='text'
                        handleChange={newValue => {
                           setSelected(newValue)
                           value.splice(0, value.length)
                           value.push(...newValue.map(n => n.id))
                        }}
                     ></FastField>
                  </FormControl>
               ) : (
                  <FormControl
                     fullWidth
                     variant={variant}
                     className={classes}
                     error={error}
                     required={rest.required || false}
                  >
                     <InputLabel id={`${id}-label`}>{rest.label}</InputLabel>
                     <FastField
                        labelId={`${id}-label`}
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
                                 renderValue={sel => {
                                    if (rest.multiple) {
                                       const namesSelected = sel.map(item => {
                                          const s = data.find(
                                             s => s.id === item
                                          )
                                          return s.name
                                       })
                                       return namesSelected.join(', ')
                                    }
                                    return data.find(d => d.id === sel).name
                                 }}
                              >
                                 {data.map(d => (
                                    <MenuItem key={d.id} value={d.id}>
                                       {rest.multiple ? (
                                          <React.Fragment>
                                             <Checkbox
                                                checked={
                                                   selected.indexOf(d.id) > -1
                                                }
                                             />
                                             <ListItemText primary={d.name} />
                                          </React.Fragment>
                                       ) : (
                                          d.name
                                       )}
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
         )}
      </React.Fragment>
   )
}

export default CustomSelect
