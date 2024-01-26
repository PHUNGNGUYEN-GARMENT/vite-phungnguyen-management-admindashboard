import { createAction } from '@reduxjs/toolkit'
import { UserRoleType } from '~/typing'

export const setAdminAction = createAction<boolean>('user/setAdmin')

export const setUserRoleAction = createAction<UserRoleType[]>('user/setUserRole')
