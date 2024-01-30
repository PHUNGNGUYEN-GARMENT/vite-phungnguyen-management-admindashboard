import { createAction } from '@reduxjs/toolkit'
import { User, UserRoleType } from '~/typing'

export const setUserAction = createAction<User>('user/setUser')

export const setAdminAction = createAction<boolean>('user/setAdmin')

export const setUserRoleAction = createAction<UserRoleType[]>('user/setUserRoles')
