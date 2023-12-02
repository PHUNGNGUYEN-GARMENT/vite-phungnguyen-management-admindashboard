import { createAction, createReducer } from '@reduxjs/toolkit'
import { User } from '~/typing'

const initialState: User = {
  isAdmin: true,
  email: '',
  fullName: ''
}

export const setUser = createAction<User>('user/setUser')

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action) => {
    const user = action.payload
    // state = { ...state, ...user }
    state.isAdmin = user.isAdmin
  })
})

export default userReducer
