import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

interface NotificationState {
    open: boolean,
    message: string,
}

const initialState: NotificationState = {
    open: false,
    message: ''
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showError: (_state, action: PayloadAction<string>) => (
            {open: true, message: action.payload}
        ),
        close: (state) => (
            {...state, open:false}
        )
    }
})

export const { showError, close } = notificationSlice.actions

export const selectNotification = (state: RootState) => state.notification

export default notificationSlice.reducer