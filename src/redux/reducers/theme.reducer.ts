export enum RootAction {
  HANDLE_SET_DARK_THEME = 'HANDLE_SET_DARK_THEME',
  HANDLE_SET_LIGHT_THEME = 'HANDLE_SET_LIGHT_THEME',
  HANDLE_TOGGLE_THEME = 'HANDLE_TOGGLE_THEME'
}

export enum Theme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  OS = 'OS'
}

export interface RootActionType {
  type: RootAction
  payload: 'dark' | 'light' | 'os'
}

export interface RootState {
  theme: 'dark' | 'light' | 'os'
}

const initState: RootState = {
  theme: 'light'
}

const themeReducer = (state: RootState = initState, action: RootActionType): RootState => {
  switch (action.type) {
    // ADDITION
    case RootAction.HANDLE_SET_DARK_THEME:
      return {
        ...state,
        theme: action.payload
      }
    // EDITION
    case RootAction.HANDLE_SET_LIGHT_THEME:
      return {
        ...state,
        theme: action.payload
      }
    // DELETE
    default:
      return {
        ...state,
        theme: action.payload
      }
  }
}

export default themeReducer
