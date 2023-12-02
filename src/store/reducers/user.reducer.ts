import { createReducer } from '@reduxjs/toolkit'
import { User } from '~/typing'

const initialState: User = {
  isAdmin: false,
  email: '',
  fullName: ''
}

const userReducer = createReducer(initialState, (builder) => {})

export default userReducer
