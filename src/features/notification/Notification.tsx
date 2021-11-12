import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { close, selectNotification } from './notificationSlice';

export const Notification = () => {
    const {open, message} = useAppSelector(selectNotification);
    const dispatch = useAppDispatch();
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            onClose={() => dispatch(close)}
            autoHideDuration={10}
        >
          <Alert variant="filled" severity="error">
            {message}
          </Alert>
      </Snackbar>
    );
}