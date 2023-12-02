import { configureStore } from '@reduxjs/toolkit'
import userReducer from '~/store/reducers/user.reducer'

export const store = configureStore({
  reducer: { user: userReducer }
})

// Lấy RootState và AppDispatch từ store chung
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
