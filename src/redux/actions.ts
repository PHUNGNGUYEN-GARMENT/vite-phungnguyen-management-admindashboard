import { RootAction, RootActionType } from './reducer'

export const handleToggleTheme = (theme: 'dark' | 'light' | 'os'): RootActionType => {
  return {
    type: RootAction.HANDLE_TOGGLE_THEME,
    payload: theme
  }
}
