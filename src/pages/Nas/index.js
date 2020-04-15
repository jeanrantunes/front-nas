import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import {
   Grid,
   Button,
   FormControl,
   Snackbar,
   CircularProgress,
   RadioGroup,
   FormControlLabel,
   Radio,
   Stepper,
   Step,
   StepLabel,
   StepContent,
   Typography,
   Paper,
   Switch,
   FormLabel
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { green, white, red } from '@material-ui/core/colors'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { TextField } from 'formik-material-ui'
import { TimePicker, DatePicker } from 'formik-material-ui-pickers'
import DateFnsUtils from '@date-io/date-fns'
import { makeStyles } from '@material-ui/core/styles'

import Layout from '../../Layouts/dashboard'
import Loader from '../../components/Loader'
import api from '../../services/api'
import { nameValidation, saps3 } from '../../utils/validations'
import { combineDateAndTime } from '../../helpers/date'
import CustomSelect from '../../containers/CustomSelect'

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
   wrapper: {
      marginTop: theme.spacing(3),
      float: 'right',
      position: 'relative'
   },
   buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12
   },
   success: {
      backgroundColor: green[500],
      color: theme.white
   },
   error: {
      backgroundColor: red[500],
      color: theme.white
   },
   buttonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
         backgroundColor: green[700]
      }
   },
   controlradio: {
      marginTop: theme.spacing(1)
   },
   radio: {
      padding: `0 ${theme.spacing(2)}px`
   },
   actionsSteper: {
      marginTop: theme.spacing(3)
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
                  name='monitoringAndControls'
                  value={values.monitoringAndControls}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='1a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Sinais vitais horários, cálculo e registro regular do balanço hídrico (registro de ingesta/ excreta)'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='1b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Presença à beira do leito e observação ou atividade contínua por 2 horas ou mais em algum plantão por razões de segurança, gravidade ou terapia, tais como: ventilação mecânica não-invasiva, desmame, agitação, confusão mental, posição prona, procedimentos de doação de órgãos, preparo e administração de fluídos ou medicação, auxílio em procedimentos específicos.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='1c'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Presença à beira do leito e observação ou atividade contínua por 4 horas ou mais, em algum plantão por razões de segurança, gravidade ou terapia.'
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
                        name='laboratoryInvestigations'
                        onChange={handleChange}
                        checked={values.laboratoryInvestigations}
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
                        name='medicationExceptVasoactiveDrugs'
                        checked={values.medicationExceptVasoactiveDrugs}
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
                  name='hygieneProcedures'
                  value={values.hygieneProcedures}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='4a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização de procedimentos de higiene tais como: curativo de feridas e cateteres intravasculares, troca de roupa de cama, higiene coeporal do paciente em situações especiais (incontinência, vômito, queimaduras, feridas com secreção, curativos cirúrgicos complexos com irrigação), procedimentos especiais (ex. isolamento), etc.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='4b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização de procedimentos de higiene que durem mais que 2 horas em algum plantão.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='4c'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização de procedimentos de higiene que duem mais do que 4 horas, em algum plantão.'
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
                        name='caringForDrains'
                        checked={values.caringForDrains}
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
                  name='mobilizationAndPositioning'
                  value={values.mobilizationAndPositioning}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='6a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização do(s) procedimento(s) de mobilização e posicionamento até 3 vezes em 24 horas.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='6b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização do(s) procedimento(s) mais do que 3 vezes em 24 horas ou com 2 enfermeiros em qualquer frequência.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='6c'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização do(s) procedimento(s) com 3 ou mais enfermeiros em qualquer ferquência.'
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
                  name='supportAndCare'
                  value={values.supportAndCare}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='7a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Suporte e cuidado aos familiares e pacientes que requerem dedicação exclusiva por cerca de uma hora em algum plantão, tais como: explicar consições clínica, lidar com a dor e angústia, lidar com circunstâncias familiares difíceis.'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='7b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Suporte e cuidado aos familiares que requerem dedicação exclusiva por 3 horas ou mais em algum plantão, tais como: circunstâncias trabalhosas (ex. grande número de familiares, problemas de linguagem, familiares hostis).'
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
                  name='administrativeAndManagerialTasks'
                  value={values.administrativeAndManagerialTasks}
                  onChange={handleChange}
               >
                  <FormControlLabel
                     value='8a'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização de tarefas administrativas e gerenciais de rotina, tais como: processamento de dados clínicos, solicitação de exames, troca de informações profissionais (por ex. passagem de plantão, visitas clínicas).'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='8b'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização de tarefas administrativas e gerenciais que requerem dedicação integral por cerca de 2 horas em algum plantão, tais como: atividades de pesquisa, aplicação de protocolos, procedimentos de admissão e alta).'
                     className={classes.controlradio}
                  />
                  <FormControlLabel
                     value='8c'
                     control={
                        <Radio className={classes.radio} color='primary' />
                     }
                     label='Realização de tarefas administrativas e gerenciais que requerem dedicação integral por cerca de 4 horas ou mais de tempo em algum plantão.'
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
                        name='ventilatorySupport'
                        checked={values.ventilatorySupport}
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
                        name='artificialAirways'
                        checked={values.artificialAirways}
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
                        name='lungFunction'
                        checked={values.lungFunction}
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
                        name='vasoactiveDrugs'
                        checked={values.vasoactiveDrugs}
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
                        name='intravenousReplacement'
                        checked={values.intravenousReplacement}
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
                        name='monitoringOfTheLeftAtrium'
                        checked={values.monitoringOfTheLeftAtrium}
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
                        name='cardiorespiratoryResumption'
                        checked={values.cardiorespiratoryResumption}
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
                        name='hemofiltrationTechniques'
                        checked={values.hemofiltrationTechniques}
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
                        name='urineOutput'
                        checked={values.urineOutput}
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
                        name='intracranialPressure'
                        checked={values.intracranialPressure}
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
                        name='acidosisTreatment'
                        checked={values.acidosisTreatment}
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
                        name='intravenousHyperalimentation'
                        checked={values.intravenousHyperalimentation}
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
                        name='enteralFeeding'
                        checked={values.enteralFeeding}
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
                        name='specificInterventionsInTheUnit'
                        checked={values.specificInterventionsInTheUnit}
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
                        name='specificInterventionsOutsideTheUnit'
                        checked={values.specificInterventionsOutsideTheUnit}
                     />
                  </Grid>
                  <Grid item>
                     <Typography variant='body1'>Sim</Typography>
                  </Grid>
               </Grid>
            </FormControl>
         )
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
const PatientSchema = Yup.object().shape({
   name: Yup.string()
      .min(4, nameValidation.tooShort)
      .max(40, nameValidation.tooLong)
      .required(nameValidation.required),
   saps3: Yup.number().min(0, saps3.tooShort).max(9999, saps3.tooLong)
})

const Nas = props => {
   const classes = useStyles()

   const { id } = props.match.params

   const [patient, setPatient] = useState(null)
   const [loading, setLoading] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)
   const timeSnack = 2000

   const buttonClassname = clsx({
      [classes.buttonSuccess]: success
   })

   const [activeStep, setActiveStep] = React.useState(0)
   const steps = getSteps()

   const handleNext = () => {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
   }

   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1)
   }

   const handleReset = () => {
      setActiveStep(0)
   }

   return (
      <Layout>
         <Formik
            initialValues={{
               monitoringAndControls: '1a',
               laboratoryInvestigations: false,
               medicationExceptVasoactiveDrugs: true,
               hygieneProcedures: '4a',
               caringForDrains: true,
               mobilizationAndPositioning: '6b',
               supportAndCare: '7a',
               administrativeAndManagerialTasks: '8b',
               ventilatorySupport: false,
               lungFunction: true,
               artificialAirways: true,
               vasoactiveDrugs: false,
               intravenousReplacement: true,
               monitoringOfTheLeftAtrium: true,
               cardiorespiratoryResumption: false,
               hemofiltrationTechniques: false,
               urineOutput: false,
               intracranialPressure: false,
               acidosisTreatment: false,
               intravenousHyperalimentation: false,
               enteralFeeding: true,
               specificInterventionsInTheUnit: false,
               specificInterventionsOutsideTheUnit: false
            }}
            //    validationSchema={PatientSchema}
            onSubmit={async (values, { setSubmitting }) => {
               console.log(values)
               //   setLoading(true)
               //   setSuccess(false)
               //   try {
               //      const {
               //         hospitalizationDate,
               //         hospitalizationTime,
               //         outcomeTime,
               //         outcomeDate,
               //         outcome,
               //         ...rest
               //      } = values
               //      const data = {
               //         ...rest,
               //         outcome: outcome || 'pending',
               //         hospitalizationDate: combineDateAndTime(
               //            hospitalizationDate,
               //            hospitalizationTime
               //         ),
               //         outcomeDate: combineDateAndTime(
               //            outcomeDate,
               //            outcomeTime
               //         )
               //      }
               //      if (!id) {
               //         await api.post('v1/patients', data)
               //      } else {
               //         await api.put(`v1/patients/${id}`, data)
               //      }

               //      setLoading(false)
               //      setSuccess(true)
               //      setError(false)

               //      setTimeout(() => {
               //         props.history.goBack()
               //         setSuccess(false)
               //      }, timeSnack)
               //   } catch (err) {
               //      setLoading(false)
               //      setSuccess(false)
               //      setError(false)
               //      setTimeout(() => {
               //         setError(false)
               //      }, timeSnack)
               //   }
            }}
         >
            {props => {
               const {
                  values,
                  touched,
                  errors,
                  handleChange,
                  handleBlur,
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
                     <Stepper activeStep={activeStep} orientation='vertical'>
                        {steps.map((label, index) => (
                           <Step key={label}>
                              <StepLabel>{label}</StepLabel>
                              <StepContent>
                                 {getStepContent(
                                    index,
                                    classes,
                                    values,
                                    handleChange
                                 )}

                                 <div className={classes.actionsSteper}>
                                    <Button
                                       disabled={activeStep === 0}
                                       onClick={handleBack}
                                       className={classes.button}
                                       size='small'
                                    >
                                       Voltar
                                    </Button>
                                    {activeStep === steps.length - 1 ? (
                                       <React.Fragment>
                                          <Button
                                             variant='contained'
                                             color='primary'
                                             size='small'
                                             type='submit'
                                             className={classes.button}
                                          >
                                             Salvar
                                          </Button>
                                          {loading && (
                                             <CircularProgress
                                                size={24}
                                                className={
                                                   classes.buttonProgress
                                                }
                                             />
                                          )}
                                       </React.Fragment>
                                    ) : (
                                       <Button
                                          variant='contained'
                                          color='primary'
                                          size='small'
                                          onClick={handleNext}
                                          className={classes.button}
                                       >
                                          Próximo
                                       </Button>
                                    )}
                                 </div>
                              </StepContent>
                           </Step>
                        ))}
                     </Stepper>
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
      </Layout>
   )
}

export default Nas
