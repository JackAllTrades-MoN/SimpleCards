import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from '../features/notification/notificationSlice'
import wordlistReducer from '../features/wordlist/wordListSlice'
import { AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

export const store = configureStore({
    reducer: {
        notification: notificationReducer,
        wordlist: wordlistReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>