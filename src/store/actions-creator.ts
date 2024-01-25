import { createAction } from '@reduxjs/toolkit'
import { UserRole } from '~/typing'

export const setAdminAction = createAction<boolean>('user/setAdmin')

export const setUserRoleAction = createAction<UserRole>('user/setUserRole')
