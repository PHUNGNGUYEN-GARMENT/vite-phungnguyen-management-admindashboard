import { createReducer } from '@reduxjs/toolkit'
import { User } from '~/typing'
import { setAdminAction, setUserRoleAction } from '../actions-creator'

const initialState: User = {
  isAdmin: true,
  email: '',
  fullName: '',
  UserRole: 'admin'
}

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setAdminAction, (state, action) => {
      state.isAdmin = action.payload
    })
    .addCase(setUserRoleAction, (state, action) => {
      state.UserRole = action.payload
    })
})

export default userReducer
