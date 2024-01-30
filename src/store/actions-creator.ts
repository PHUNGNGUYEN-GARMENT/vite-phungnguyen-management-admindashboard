import { createAction } from '@reduxjs/toolkit'
import { User, UserRoleType } from '~/typing'

export const setUserAction = createAction<User>('user/setUser')

export const setUserRoleAction = createAction<UserRoleType[]>('user/setUserRoles')
