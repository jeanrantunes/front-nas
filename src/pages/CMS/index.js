import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import { enableSteps, enableButtonHelp } from '../../store/actions/stepByStep'

import Layout from '../../Layouts/dashboard'
import MaterialTableAPI from '../../containers/CustomMT'

const useStyles = makeStyles(theme => ({
   spacer: {
      marginTop: theme.spacing(5)
   }
}))

const CMS = props => {
   const classes = useStyles()
   const dispatch = useDispatch()

   const [loaderComorbidities, setLoaderComorbidities] = useState(true)
   const [loaderHospitalization, setLoaderHospitalization] = useState(true)

   useEffect(() => {
      if (!loaderComorbidities && !loaderHospitalization) {
         setTimeout(() => {
            dispatch(enableSteps())
            dispatch(enableButtonHelp())
         }, 2000)
      }
   }, [loaderComorbidities, loaderHospitalization, dispatch])

   return (
      <Layout
         {...props}
         steps={[
            {
               element: '.management-link',
               intro:
                  'Página de gerenciamento de conteúdo. Está página gerencia o conteúdo de comorbidades e motivos de internação dos pacientes.'
            },
            {
               element: '.comorbidities-cms',
               intro: 'Gerenciador de conteúdo para comorbidades'
            },
            {
               element: '.comorbidities-cms [placeholder="Search"]',
               intro: 'Busca sobre as comorbidades'
            },
            {
               element: '.comorbidities-cms [title="Adicionar"]',
               intro: 'Adicionar uma nova comorbidade ao sistema'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableBody-root .MuiTableRow-root',
               intro: 'Comorbidade'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableBody-root .MuiTableRow-root .MuiButtonBase-root:nth-child(1)',
               intro: 'Editar o nome da comorbidade'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableBody-root .MuiTableRow-root .MuiButtonBase-root:nth-child(2)',
               intro: 'Excluir a comorbidade'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableFooter-root .MuiSelect-selectMenu',
               intro: 'Número de comorbidades a serem mostradas na tabela.'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableFooter-root [title="Primeiro"]',
               intro: 'Vai para primeira página de comorbidades'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableFooter-root .MuiTypography-caption',
               intro: 'Informação sobre as páginas de comorbidades'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableFooter-root [title="Anterior"]',
               intro: 'Vai para página anterior de comorbidades'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableFooter-root [title="Próximo"]',
               intro: 'Vai para próxima página de comorbidades'
            },
            {
               element:
                  '.comorbidities-cms .MuiTableFooter-root [title="Último"]',
               intro: 'Vai para última página de comorbidades'
            },

            {
               element: '.hospitalization-reason-cms',
               intro: 'Gerenciador de conteúdo para motivos de internação'
            },

            {
               element: '.hospitalization-reason-cms [placeholder="Search"]',
               intro: 'Busca sobre os motivos de internação'
            },
            {
               element: '.hospitalization-reason-cms [title="Adicionar"]',
               intro: 'Adicionar um novo motivo de internação ao sistema'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableBody-root .MuiTableRow-root',
               intro: 'Motivo da internação'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableBody-root .MuiTableRow-root .MuiButtonBase-root:nth-child(1)',
               intro: 'Editar o nome do motivo da internação'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableBody-root .MuiTableRow-root .MuiButtonBase-root:nth-child(2)',
               intro: 'Excluir o motivo da internação'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableFooter-root .MuiSelect-selectMenu',
               intro:
                  'Número de motivos de internação a serem mostrados na tabela.'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableFooter-root [title="Primeiro"]',
               intro: 'Vai para primeira página de motivos de internação'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableFooter-root .MuiTypography-caption',
               intro: 'Informação sobre as páginas de motivos de internação'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableFooter-root [title="Anterior"]',
               intro: 'Vai para página anterior de motivos de internação'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableFooter-root [title="Próximo"]',
               intro: 'Vai para próxima página de motivos de internação'
            },
            {
               element:
                  '.hospitalization-reason-cms .MuiTableFooter-root [title="Último"]',
               intro: 'Vai para última página de motivos de internação'
            },
            {
               element: '.help-button',
               intro: 'Sempre que precisar de ajuda, clique aqui!'
            }
         ]}
      >
         <MaterialTableAPI
            loader={loaderComorbidities}
            setLoader={setLoaderComorbidities}
            title='Comorbidades'
            columnTitle='Comorbidade'
            urlGet='v1/comorbidities'
            urlPost='v1/comorbidity'
            urlPut='v1/comorbidity'
            urlDelete='v1/comorbidity'
            className='comorbidities-cms'
         />

         <MaterialTableAPI
            loader={loaderHospitalization}
            setLoader={setLoaderHospitalization}
            title='Motivos de internação'
            columnTitle='Motivos'
            urlGet='v1/hospitalization-reason'
            urlPost='v1/hospitalization-reason'
            urlPut='v1/hospitalization-reason'
            urlDelete='v1/hospitalization-reason'
            className={`${classes.spacer} hospitalization-reason-cms`}
         />
      </Layout>
   )
}

export default CMS
