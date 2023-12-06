import { createAction } from '@reduxjs/toolkit'
import { Role } from '~/typing'

export const setAdminAction = createAction<boolean>('user/setAdmin')

export const setRoleAction = createAction<Role>('user/setRole')
