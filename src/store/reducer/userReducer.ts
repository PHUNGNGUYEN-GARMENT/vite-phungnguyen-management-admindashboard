import { createReducer } from '@reduxjs/toolkit'
import { User } from '~/typing'
import { setAdminAction } from '../actions-creator'

const initialState: User = {
  isAdmin: true,
  email: '',
  fullName: ''
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAdminAction, (state, action) => {
    state.isAdmin = action.payload
  })
})

export default userReducer
