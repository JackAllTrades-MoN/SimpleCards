import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { close, selectNotification } from './notificationSlice';

export const Notification = () => {
    const {open, message} = useAppSelector(selectNotification);
    const dispatch = useAppDispatch();
    const closeSnackBar = () => {
      dispatch(close())
    }
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={closeSnackBar}
            autoHideDuration={5000}
        >
          <Alert variant="filled" severity="error">
            {message}
          </Alert>
      </Snackbar>
    );
}