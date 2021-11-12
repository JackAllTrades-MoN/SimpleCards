import React, {useEffect, useState } from 'react'

import Backdrop from '@mui/material/Backdrop'
import Fab from '@mui/material/Fab'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import AddIcon from '@mui/icons-material/Add'
import Stack from '@mui/material/Stack'
import withStyles, {WithStylesProps} from 'react-jss'
import { WordInput } from './features/WordInput'
import { Notification } from './features/notification/Notification'
import { useAppDispatch } from './app/hooks'
import { WordList } from './features/wordlist/WordList'
import { addWord } from './features/wordlist/wordListSlice'

const styles = {
  app: {
    "& .btns": {
      position: 'fixed',
      top: 'auto',
      left: 'auto',
      right: '20px',
      bottom: '20px'
    },
  },
};

interface IProps extends WithStylesProps<typeof styles> {
  children?: React.ReactNode
}

function App(props: IProps) {
  const { classes } = props;
  const dispatch = useAppDispatch();
  const [windowHeight, setWindowHeight] = useState<number>(0);

  useEffect(() => {
    setWindowHeight(window.outerHeight);    
    window.addEventListener('resize', () => {
      setWindowHeight(window.outerHeight);
    });
  }, []);

  const [bdopen, setBdopen] = useState<boolean>(false);

  return (
    <div
      tabIndex={-1}
      className={classes.app}
      onKeyDown={() => {setBdopen(true)}}
      style={{height: windowHeight}}
    >
      <Backdrop
        open={bdopen}
        onClick={() => setBdopen(false)}
      >
        <WordInput setWord={(word: string) => dispatch(addWord(word))} />
      </Backdrop>
      <Notification />
      <WordList />
      <Stack direction="row" spacing={2} className="btns">
        <Fab color="primary">
          <AddIcon />
        </Fab>
        <Fab color="secondary">
          <DownloadIcon />
        </Fab>
        <Fab color="secondary">
          <UploadIcon />
        </Fab>
      </Stack>
    </div>
  );
}

export default withStyles(styles)(App);
