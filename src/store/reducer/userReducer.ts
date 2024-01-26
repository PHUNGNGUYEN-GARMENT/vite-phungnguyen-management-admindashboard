import { createReducer } from '@reduxjs/toolkit'
import { ItemStatusType, UserRoleType } from '~/typing'
import { setAdminAction, setUserRoleAction } from '../actions-creator'

interface AppUser {
  fullName?: string
  username?: string
  password?: string
  avatar?: string
  phone?: string
  isAdmin?: boolean
  workDescription?: string
  birthday?: string
  roleID?: number
  userID?: number
  roles?: UserRoleType[]
  shortName?: string
  desc?: string
  status?: ItemStatusType
}

const initialState: AppUser = {
  isAdmin: false,
  roles: ['product_manager']
}

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setAdminAction, (state, action) => {
    state.isAdmin = action.payload
  })
  builder.addCase(setUserRoleAction, (state, action) => {
    state.roles = action.payload
  })
})

export default userReducer
