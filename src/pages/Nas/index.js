import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Formik } from 'formik'
import {
   Grid,
   Button,
   FormControl,
   Snackbar,
   RadioGroup,
   FormControlLabel,
   Radio,
   Stepper,
   Step,
   StepLabel,
   StepContent,
   Typography,
   Switch
} from '@material-ui/core'

import { UnfoldMoreOutlined, UnfoldLess } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { green, red } from '@material-ui/core/colors'

import { makeStyles } from '@material-ui/core/styles'

import { enableButtonHelp } from '../../store/actions/stepByStep'

import Layout from '../../Layouts/dashboard'
import api from '../../services/api'
import ButtonLoading from '../../components/ButtonLoading'
import { isEmpty } from 'lodash-es'
import { getQueryStringValue } from '../../helpers/queryString'

const useStyles = makeStyles(theme => ({
   paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3)
   },
   formControl: {
      marginBottom: theme.spacing(3)
   },
   submit: {
      margin: theme.spacing(3, 0, 2)
   },
   chips: {
      display: 'flex',
      flexWrap: 'wrap'
   },
   chip: {
      margin: 2
   },
   noLabel: {
      marginTop: theme.spacing(3)
   },
   wrapperLoading: {
      marginTop: theme.spacing(3),
      float: 'right',
      position: 'relative'
   },
   success: {
      backgroundColor: green[500],
      color: theme.white
   },
   error: {
      backgroundColor: red[500],
      color: theme.white
   },
   controlradio: {
      marginTop: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
         alignItems: 'start',
         marginTop: theme.spacing(3),
         marginRight: 0,
         '& > span': {
            padding: 4,
            fontSize: theme.typography.body2.fontSize
         }
      }
   },
   radio: {
      padding: `0 ${theme.spacing(2)}px`
   },
   actionsSteper: {
      marginTop: theme.spacing(3)
   },
   buttonSubmit: {
      // marginLeft: theme.spacing(6),
      [theme.breakpoints.down('sm')]: {
         float: 'right'
      }
   },
   expandButton: {
      float: 'right'
   },
   stepper: {
      [theme.breakpoints.down('sm')]: {
         padding: 0
      }
   },
   stepperContent: {
      [theme.breakpoints.down('sm')]: {
         paddingRight: 0,
         paddingLeft: 14,
         '& p': {
            fontSize: theme.typography.body2.fontSize
         }
      }
   }
}))

function getStepContent(step, classes, values, handleChange) {
   switch (step) {
      case 0:
         return (
            <FormControl component='fieldset'>
               <RadioGroup
                  row
                  aria-label='position'
                  name='monitoring_and_controls'
                  value={values.monitoring_and_controls}
                  onChange={handleChange}
                  className={'step-1'}
               >
                  <FormControlLabel
                     value='1a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='1a) Sinais vitais horários, cálculo e registro regular do balanço hídrico (registro de ingesta/ excreta)'
                     className={`${classes.controlradio} option-1`}
                  />
                  <FormControlLabel
                     value='1b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='1b) Presença à beira do leito e observação ou atividade contínua por 2 horas ou mais em algum plantão por razões de segurança, gravidade ou terapia, tais como: ventilação mecânica não-invasiva, desmame, agitação, confusão mental, posição prona, procedimentos de doação de órgãos, preparo e administração de fluídos ou medicação, auxílio em procedimentos específicos.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='1c'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='1c) Presença à beira do leito e observação ou atividade contínua por 4 horas ou mais, em algum plantão por razões de segurança, gravidade ou terapia.'
                     className={classes.controlradio}
                  />
               </RadioGroup>
            </FormControl>
         )
      case 1:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Bioquímica e microbiológicas
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        color='primary'
                        name='laboratory_investigations'
                        onChange={handleChange}
                        checked={values.laboratory_investigations}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 2:
         return (
            <FormControl component='fieldset'>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='medication_except_vasoactive_drugs'
                        checked={values.medication_except_vasoactive_drugs}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 3:
         return (
            <FormControl component='fieldset'>
               <RadioGroup
                  row
                  aria-label='position'
                  name='hygiene_procedures'
                  value={values.hygiene_procedures}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='4a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='4a) Realização de procedimentos de higiene tais como: curativo de feridas e cateteres intravasculares, troca de roupa de cama, higiene coeporal do paciente em situações especiais (incontinência, vômito, queimaduras, feridas com secreção, curativos cirúrgicos complexos com irrigação), procedimentos especiais (ex. isolamento), etc.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='4b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='4b) Realização de procedimentos de higiene que durem mais que 2 horas em algum plantão.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='4c'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='4c) Realização de procedimentos de higiene que duem mais do que 4 horas, em algum plantão.'
                     className={classes.controlradio}
                  />
               </RadioGroup>
            </FormControl>
         )
      case 4:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Todos (exceto sonda gástrica)
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='caring_for_drains'
                        checked={values.caring_for_drains}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 5:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Mobilização e posicionamento incluindo procedimentos tais
                  como: mudança de decúbito, mobilização do paciente:
                  tranferência da cama para a cadeira: mobilização do paciente
                  em equipe (exemplo de paciente imóvel, tração, posição prona)
               </Typography>
               <RadioGroup
                  row
                  aria-label='position'
                  name='mobilization_and_positioning'
                  value={values.mobilization_and_positioning}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='6a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='6a) Realização do(s) procedimento(s) de mobilização e posicionamento até 3 vezes em 24 horas.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='6b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='6b) Realização do(s) procedimento(s) mais do que 3 vezes em 24 horas ou com 2 enfermeiros em qualquer frequência.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='6c'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='6c) Realização do(s) procedimento(s) com 3 ou mais enfermeiros em qualquer ferquência.'
                     className={classes.controlradio}
                  />
               </RadioGroup>
            </FormControl>
         )
      case 6:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Suporte e cuidados aos familiares e pacientes incluindo
                  procedimentos tais como: telefonemas, entrevistas,
                  aconselhamento. Frequentemente, o suporte e cuidado , sejam
                  aos familiares ou aos pacientes, permitem à equipe continuar
                  com outras atividades de enfermagem (ex. comunicação com os
                  familiares enquanto presente à beira do leito observando o
                  paciente).
               </Typography>
               <RadioGroup
                  row
                  aria-label='position'
                  name='support_and_care'
                  value={values.support_and_care}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='7a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='7a) Suporte e cuidado aos familiares e pacientes que requerem dedicação exclusiva por cerca de uma hora em algum plantão, tais como: explicar consições clínica, lidar com a dor e angústia, lidar com circunstâncias familiares difíceis.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='7b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='7b) Suporte e cuidado aos familiares que requerem dedicação exclusiva por 3 horas ou mais em algum plantão, tais como: circunstâncias trabalhosas (ex. grande número de familiares, problemas de linguagem, familiares hostis).'
                     className={classes.controlradio}
                  />
               </RadioGroup>
            </FormControl>
         )
      case 7:
         return (
            <FormControl component='fieldset'>
               <RadioGroup
                  row
                  aria-label='position'
                  name='administrative_and_managerial_tasks'
                  value={values.administrative_and_managerial_tasks}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='8a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='8a) Realização de tarefas administrativas e gerenciais de rotina, tais como: processamento de dados clínicos, solicitação de exames, troca de informações profissionais (por ex. passagem de plantão, visitas clínicas).'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='8b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='8b) Realização de tarefas administrativas e gerenciais que requerem dedicação integral por cerca de 2 horas em algum plantão, tais como: atividades de pesquisa, aplicação de protocolos, procedimentos de admissão e alta).'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='8c'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='8c) Realização de tarefas administrativas e gerenciais que requerem dedicação integral por cerca de 4 horas ou mais de tempo em algum plantão.'
                     className={classes.controlradio}
                  />
               </RadioGroup>
            </FormControl>
         )
      case 8:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Qualquer forma de ventilação mecânica/ventilação assistida com
                  ou sem pressão expiratória final positiva, com ou sem
                  relaxantes musculares; respiração espontânea com ou sem
                  pressão espiratória final positiva (e.g. CPAP ou BiBAP), com
                  ou sem tubo endotraqueal; oxigênio suplementar por qualquer
                  método.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='ventilatory_support'
                        checked={values.ventilatory_support}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 9:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Tratamento para melhora da função pulmonar. Fisioterapia
                  torácica, espirometria estimulada, terapia inalatória,
                  aspiração endotraqueal.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='artificial_airways'
                        checked={values.artificial_airways}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 10:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Cuidado com vias aéreas artificiais. Tubo endotraqueal ou
                  cânula de traqueostomia.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='lung_function'
                        checked={values.lung_function}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )

      case 11:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Medicação vasoativa independente do tipo e dose.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='vasoactive_drugs'
                        checked={values.vasoactive_drugs}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 12:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Reposição intravenosa de grandes perdas de fluídos.
                  Administração de fluídos > 31/m²/dia, independente do tipo de
                  fluído administrado.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='intravenous_replacement'
                        checked={values.intravenous_replacement}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 13:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Monitorização do átrio esquerdo, com ou sem medida de débito
                  cardíaco.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='monitoring_of_the_left_atrium'
                        checked={values.monitoring_of_the_left_atrium}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 14:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Reanimação cardiorrespiratória nas últimas 24 horas (excluído
                  soco precordial).
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='cardiorespiratory_resumption'
                        checked={values.cardiorespiratory_resumption}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 15:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Técnicas de hemofiltração. Técnicas dialíticas.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='hemofiltration_techniques'
                        checked={values.hemofiltration_techniques}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 16:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Medida quantitativa do débito urinário (ex. sonda vesical de
                  demora).
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='urine_output'
                        checked={values.urine_output}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 17:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Medida de pressão intracraniana.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='intracranial_pressure'
                        checked={values.intracranial_pressure}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 18:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Tratamento da acidose/alcalose metabólica complicada.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='acidosis_treatment'
                        checked={values.acidosis_treatment}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 19:
         return (
            <FormControl component='fieldset'>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='intravenous_hyperalimentation'
                        checked={values.intravenous_hyperalimentation}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 20:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Alimetação Enteral. Através de tubo gástrico ou outra via
                  gastrintestinal (ex. jejunostomia).
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='enteral_feeding'
                        checked={values.enteral_feeding}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 21:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Intervenções específicas na unidade de terapia intensiva.
                  Intubação endotraqueal, inserção de marca-passo, cardioversão,
                  endoscopias, cirurgia de emergência no último período de 24
                  horas, lavagem gástrica. Não estão incluídas intervenções de
                  rotina sem consequências diretas para as condições clínicas do
                  paciente, tais como: Curativos ou inserção de cateteres
                  venosos ou arteriais.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='specific_interventions_in_the_unit'
                        checked={values.specific_interventions_in_the_unit}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      case 22:
         return (
            <FormControl component='fieldset'>
               <Typography variant='body1'>
                  Intervenções específicas fora da unidade de terrapia
                  intensiva. Procedimentos diagnósticos ou cirúrgicos tais como:
                  Raio-X, ecografia, eletrocardiograma, que exijam
                  acompanhamento.
               </Typography>
               <Grid
                  component='label'
                  container
                  alignItems='center'
                  spacing={1}
               >
                  <Grid item>
                     <Typography variant='body1'>Não</Typography>
                  </Grid>
                  <Grid item>
                     <Switch
                        onChange={handleChange}
                        color='primary'
                        name='specific_interventions_outside_the_unit'
                        checked={values.specific_interventions_outside_the_unit}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
      default:
         return
   }
}

function getSteps() {
   return [
      'Monitorização e Controles',
      'Investigações laboratoriais',
      'Medicação, exceto drogas vasoativas',
      'Procedimentos de higiene',
      'Cuidados com drenos',
      'Mobilização e posicionamento',
      'Suporte e Cuidados',
      'Tarefas Administrativas e Gerenciais',
      'Suporte ventilatório',
      'Vias aéreas artificiais',
      'Função pulmonar',
      'Medicação Vosativa',
      'Reposição intravenosa',
      'Monitorização do átrio esquerdo',
      'Reaminação cardiorrespiratória',
      'Técnicas de Hemofiltração',
      'Débito uninário',
      'Pressão Intracraniana',
      'Tratamento da acidose',
      'Hiperalimentação intravenosa',
      'Alimentação Enteral',
      'Intervenções específicas na unidade',
      'Intervenções específicas fora da unidade'
   ]
}

const Nas = props => {
   const classes = useStyles()
   const dispatch = useDispatch()

   const { id } = props.match.params

   const [nas, setNas] = useState(undefined)
   const [openAll, setOpenAll] = useState(false)
   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)
   const timeSnack = 2000

   useEffect(() => {
      if (!isEmpty(nas)) {
         setOpenAll(true)
      }
   }, [nas])

   useEffect(() => {
      const getNas = async id => {
         try {
            const { data } = await api.get(`/v1/nas/${id}`)
            setNas(data)
         } catch (error) {
            setNas({})
         }
      }
      const idNas = parseInt(id)
      /* in this case its a create nas */
      if (id && id.length < 23) {
         getNas(idNas)
      } else if (id.length > 23) {
         setNas({})
      }
   }, [id])

   useEffect(() => {
      setTimeout(() => {
         dispatch(enableButtonHelp())
      }, 1000)
   }, [dispatch])

   const [activeStep, setActiveStep] = React.useState(0)
   const steps = getSteps()

   const handleNext = () => {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
   }

   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1)
   }

   return (
      <Layout
         {...props}
         steps={[
            {
               element: '.step-1',
               intro: 'Primeiro item do NAS: Monitorização e controles'
            },
            {
               element: '.option-1',
               intro: 'Opção selecionada'
            },
            {
               element: '.expand-button',
               intro: 'Expande ou retrai todos os 23 itens do NAS'
            }
         ]}
      >
         <Grid container>
            <Grid item xs={12}>
               <Button
                  variant='contained'
                  color='primary'
                  startIcon={openAll ? <UnfoldLess /> : <UnfoldMoreOutlined />}
                  onClick={() => setOpenAll(!openAll)}
                  className={`${classes.expandButton} expand-button`}
               >
                  {openAll ? 'Retrair' : 'Expandir'}
               </Button>
            </Grid>
            <Grid item xs={12}>
               {nas && (
                  <React.Fragment>
                     <Formik
                        initialValues={{
                           monitoring_and_controls:
                              nas.monitoring_and_controls || '1a',
                           laboratory_investigations: isNaN(
                              nas.laboratory_investigations
                           )
                              ? false
                              : nas.laboratory_investigations,
                           medication_except_vasoactive_drugs: isNaN(
                              nas.medication_except_vasoactive_drugs
                           )
                              ? true
                              : nas.medication_except_vasoactive_drugs,
                           hygiene_procedures: nas.hygiene_procedures || '4a',
                           caring_for_drains: isNaN(nas.caring_for_drains)
                              ? true
                              : nas.caring_for_drains,
                           mobilization_and_positioning:
                              nas.mobilization_and_positioning || '6b',
                           support_and_care: nas.support_and_care || '7a',
                           administrative_and_managerial_tasks:
                              nas.administrative_and_managerial_tasks || '8b',
                           ventilatory_support: isNaN(nas.ventilatory_support)
                              ? false
                              : nas.ventilatory_support,
                           lung_function: isNaN(nas.lung_function)
                              ? true
                              : nas.lung_function,
                           artificial_airways: isNaN(nas.artificial_airways)
                              ? true
                              : nas.artificial_airways,
                           vasoactive_drugs: isNaN(nas.vasoactive_drugs)
                              ? false
                              : nas.vasoactive_drugs,
                           intravenous_replacement: isNaN(
                              nas.intravenous_replacement
                           )
                              ? true
                              : false,
                           monitoring_of_the_left_atrium: isNaN(
                              nas.monitoring_of_the_left_atrium
                           )
                              ? true
                              : nas.monitoring_of_the_left_atrium,
                           cardiorespiratory_resumption: isNaN(
                              nas.cardiorespiratory_resumption
                           )
                              ? false
                              : nas.cardiorespiratory_resumption,
                           hemofiltration_techniques: isNaN(
                              nas.hemofiltration_techniques
                           )
                              ? false
                              : nas.hemofiltration_techniques,
                           urine_output: isNaN(nas.urine_output)
                              ? false
                              : nas.urine_output,
                           intracranial_pressure: isNaN(
                              nas.intracranial_pressure
                           )
                              ? false
                              : nas.intracranial_pressure,
                           acidosis_treatment: isNaN(nas.acidosis_treatment)
                              ? false
                              : nas.acidosis_treatment,
                           intravenous_hyperalimentation: isNaN(
                              nas.intravenous_hyperalimentation
                           )
                              ? false
                              : nas.intravenous_hyperalimentation,
                           enteral_feeding: isNaN(nas.enteral_feeding)
                              ? true
                              : nas.enteral_feeding,
                           specific_interventions_in_the_unit: isNaN(
                              nas.specific_interventions_in_the_unit
                           )
                              ? false
                              : nas.specific_interventions_in_the_unit,
                           specific_interventions_outside_the_unit: isNaN(
                              nas.specific_interventions_outside_the_unit
                           )
                              ? false
                              : nas.specific_interventions_outside_the_unit,
                           nas_date: getQueryStringValue('nas_date')
                              ? new Date(getQueryStringValue('nas_date'))
                              : new Date()
                        }}
                        onSubmit={async (values, { setSubmitting }) => {
                           setLoading(true)
                           setSuccess(false)
                           try {
                              if (isEmpty(nas)) {
                                 await api.post('v1/nas', {
                                    ...values,
                                    patient_id: id
                                 })
                              } else {
                                 delete values.nas_date
                                 await api.put(`v1/nas/${id}`, {
                                    ...values,
                                    patient_id: nas.patient_id
                                 })
                              }

                              setLoading(false)
                              setSuccess(true)
                              setError(false)

                              setTimeout(() => {
                                 props.history.goBack()
                                 setSuccess(false)
                              }, timeSnack)
                           } catch (err) {
                              setLoading(false)
                              setSuccess(false)
                              setError(false)
                              setTimeout(() => {
                                 setError(false)
                              }, timeSnack)
                           }
                        }}
                     >
                        {/* {!nas.enteral_feeding && 'asdasdas'} */}
                        {props => {
                           const {
                              values,

                              handleChange,

                              handleSubmit
                           } = props
                           return (
                              <form
                                 className={classes.form}
                                 onSubmit={e => {
                                    e.preventDefault()
                                    handleSubmit()
                                 }}
                                 noValidate
                              >
                                 <Stepper
                                    activeStep={activeStep}
                                    orientation='vertical'
                                    className={classes.stepper}
                                 >
                                    {steps.map((label, index) => (
                                       <Step key={label} expanded={openAll}>
                                          <StepLabel>{label}</StepLabel>
                                          <StepContent
                                             className={classes.stepperContent}
                                          >
                                             {getStepContent(
                                                index,
                                                classes,
                                                values,
                                                handleChange
                                             )}

                                             <div
                                                className={
                                                   classes.actionsSteper
                                                }
                                             >
                                                {!openAll && (
                                                   <React.Fragment>
                                                      <Button
                                                         disabled={
                                                            activeStep === 0
                                                         }
                                                         onClick={handleBack}
                                                         className={
                                                            classes.button
                                                         }
                                                         size='small'
                                                      >
                                                         Voltar
                                                      </Button>
                                                      {activeStep ===
                                                      steps.length - 1 ? (
                                                         <ButtonLoading
                                                            variant='contained'
                                                            color='primary'
                                                            type='submit'
                                                            loading={loading}
                                                            success={success}
                                                            wrapperClass={
                                                               classes.wrapperLoading
                                                            }
                                                            className={
                                                               classes.button
                                                            }
                                                         >
                                                            Salvar
                                                         </ButtonLoading>
                                                      ) : (
                                                         <Button
                                                            variant='contained'
                                                            color='primary'
                                                            size='small'
                                                            onClick={handleNext}
                                                            className={
                                                               classes.button
                                                            }
                                                         >
                                                            Próximo
                                                         </Button>
                                                      )}
                                                   </React.Fragment>
                                                )}
                                             </div>
                                          </StepContent>
                                       </Step>
                                    ))}
                                 </Stepper>
                                 {openAll && (
                                    <ButtonLoading
                                       variant='contained'
                                       color='primary'
                                       type='submit'
                                       loading={loading}
                                       success={success}
                                       wrapperClass={classes.wrapperLoading}
                                       className={classes.buttonSubmit}
                                    >
                                       Salvar
                                    </ButtonLoading>
                                 )}
                                 <Snackbar open={success}>
                                    <Alert variant='filled' severity='success'>
                                       Salvo com sucesso :D
                                    </Alert>
                                 </Snackbar>
                                 <Snackbar open={error}>
                                    <Alert variant='filled' severity='error'>
                                       Algo deu errado :(
                                    </Alert>
                                 </Snackbar>
                              </form>
                           )
                        }}
                     </Formik>
                  </React.Fragment>
               )}
            </Grid>
         </Grid>
      </Layout>
   )
}

export default Nas
