import { createReducer } from '@reduxjs/toolkit'
import { User, UserRoleType } from '~/typing'
import { setUserAction, setUserRoleAction } from '../actions-creator'

interface AppUser {
  user: User
  userRoles: UserRoleType[]
}

const initialState: AppUser = {
  user: {},
  userRoles: ['staff']
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUserAction, (state, action) => {
    state.user = action.payload
  })
  builder.addCase(setUserRoleAction, (state, action) => {
    state.userRoles = action.payload
  })
})

export default userReducer
