import { createReducer } from '@reduxjs/toolkit'
import { UserRoleType } from '~/typing'
import { setAdminAction, setUserRoleAction } from '../actions-creator'

interface AppUser {
  isAdmin: boolean
  userRoles: UserRoleType[]
}

const initialState: AppUser = {
  isAdmin: false,
  userRoles: ['staff']
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAdminAction, (state, action) => {
    state.isAdmin = action.payload
  })
  builder.addCase(setUserRoleAction, (state, action) => {
    state.userRoles = action.payload
  })
})

export default userReducer
