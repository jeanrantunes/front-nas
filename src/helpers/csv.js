export const json2csv = (items, title = 'exportFile') => {
   const replacer = (key, value) => (value === null ? '' : value)
   const header = Object.keys(items[0])
   let csv = items.map(row =>
      header
         .map(fieldName => JSON.stringify(row[fieldName], replacer))
         .join(',')
   )
   csv.unshift(header.join(','))
   csv = csv.join('\r\n')

   const downloadLink = document.createElement('a')
   const blob = new Blob(['\ufeff', csv])
   const url = URL.createObjectURL(blob)
   downloadLink.href = url
   downloadLink.download = `${title}.csv`
   document.body.appendChild(downloadLink)
   downloadLink.click()
   document.body.removeChild(downloadLink)
}
