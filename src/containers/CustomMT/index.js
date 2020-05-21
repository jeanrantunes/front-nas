import React from 'react'
import MaterialTable from 'material-table'

import api from '../../services/api'

const MT = props => {
   const {
      columnTitle,
      urlGet,
      urlPost,
      urlPut,
      urlDelete,
      className,
      ...rest
   } = props
   return (
      <div className={className}>
         <MaterialTable
            {...rest}
            columns={[{ title: columnTitle, field: 'name' }]}
            data={query =>
               new Promise(async (resolve, reject) => {
                  let {
                     orderDirection: order_type,
                     page,
                     pageSize: items_per_page,
                     search: name
                  } = query

                  if (!order_type) {
                     order_type = 'ASC'
                  }
                  if (!name) {
                     name = null
                  }
                  try {
                     const { data } = await api.get(urlGet, {
                        params: { page, items_per_page, name, order_type }
                     })
                     resolve({
                        data: data.data,
                        page: data.metadata.page,
                        totalCount: data.metadata.total
                     })
                  } catch (err) {
                     reject('Sem dados')
                  }
               })
            }
            editable={{
               onRowAdd: newData =>
                  new Promise(async (resolve, reject) => {
                     try {
                        const { data } = await api.post(urlPost, newData)
                        resolve(data)
                     } catch (err) {
                        reject('Erro')
                     }
                  }),
               onRowUpdate: (newData, oldData) =>
                  new Promise(async (resolve, reject) => {
                     delete newData.id
                     try {
                        const { data } = await api.put(
                           `${urlPut}/${oldData.id}`,
                           newData
                        )
                        resolve(data)
                     } catch (err) {
                        reject('Erro')
                     }
                  }),
               onRowDelete: oldData =>
                  new Promise(async (resolve, reject) => {
                     try {
                        const { data } = await api.delete(
                           `${urlDelete}/${oldData.id}`
                        )
                        resolve(data)
                     } catch (err) {
                        reject('Erro')
                     }
                  })
            }}
            localization={{
               body: {
                  emptyDataSourceMessage: 'Sem dados para exibir',
                  addTooltip: 'Adicionar',
                  deleteTooltip: 'Deletar',
                  editTooltip: 'Editar',
                  header: {
                     actions: 'Ações'
                  },
                  editRow: {
                     deleteText: `Tem certeza que deseja excluir está ${columnTitle}?`,
                     cancelTooltip: 'Cancelar',
                     saveTooltip: 'Salvar'
                  },
                  toolbar: {
                     searchTooltip: 'Pesquisar',
                     searchPlaceholder: 'Pesquisar'
                  }
               },
               pagination: {
                  labelRowsSelect: 'linhas',
                  labelDisplayedRows: ' {from}-{to} de {count} linhas',
                  firstTooltip: 'Primeiro',
                  previousTooltip: 'Anterior',
                  nextTooltip: 'Próximo',
                  lastTooltip: 'Último'
               }
            }}
            options={{
               sorting: true,
               actionsColumnIndex: -1,
               addRowPosition: 'first',
               pageSize: 10
            }}
         />
      </div>
   )
}

export default MT
