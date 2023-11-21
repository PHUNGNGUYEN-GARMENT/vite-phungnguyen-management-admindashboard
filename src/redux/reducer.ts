

const rootReducer = (state: RootState = initState, action: RootActionType): RootState => {
  switch (action.type) {
    // ADDITION
    case RootAction.HANDLE_SET_DARK_THEME:
      return {
        ...state,
        theme: 'dark'
      }
    // EDITION
    case RootAction.HANDLE_SET_LIGHT_THEME:
      return {
        ...state,
        theme: 'light'
      }
    // DELETE
    default:
      return {
        ...state,
        theme: 'os'
      }
  }
}

export default rootReducer
