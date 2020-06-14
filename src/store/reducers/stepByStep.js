const INITIAL_STATE = {
   stepsEnabled: false,
   buttonHelp: false,
   initialStep: 0
}

export default function steps(state = INITIAL_STATE, action) {
   switch (action.type) {
      case 'ENABLE_STEPS':
         return { ...state, stepsEnabled: true }
      case 'DISABLE_STEPS':
         return { ...state, stepsEnabled: false }
      case 'ENABLE_BUTTON_HELP':
         return { ...state, buttonHelp: true }
      case 'DISABLE_BUTTON_HELP':
         return { ...state, buttonHelp: false }
      default:
         return state
   }
}
