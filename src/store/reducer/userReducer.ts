import { createReducer } from '@reduxjs/toolkit'
import { User } from '~/typing'
import { setAdminAction, setRoleAction } from '../actions-creator'

const initialState: User = {
  isAdmin: true,
  email: '',
  fullName: '',
  role: 'admin'
}

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAdminAction, (state, action) => {
      state.isAdmin = action.payload
    })
    .addCase(setRoleAction, (state, action) => {
      state.role = action.payload
    })
})

export default userReducer
