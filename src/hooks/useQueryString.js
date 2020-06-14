import { useState, useCallback } from 'react'
import {
   getQueryStringValue,
   setQueryStringValue,
   removeKeyQueryString
} from '../helpers/queryString'

function useQueryString(key, initialValue) {
   const valueQuery = getQueryStringValue(key)
   const [value, setValue] = useState(valueQuery || initialValue)

   const onSetValue = useCallback(
      newValue => {
         setValue(newValue)

         if (!newValue || newValue.length === 0) {
            removeKeyQueryString(key)
            return
         }

         setQueryStringValue(key, newValue)
      },
      [key]
   )

   return [value, onSetValue]
}

export default useQueryString
