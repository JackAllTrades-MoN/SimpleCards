import React, {useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import Fab from '@mui/material/Fab';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AddIcon from '@mui/icons-material/Add';
import withStyles, {WithStylesProps} from 'react-jss';
import { searchDict } from './api';
import { WordInput } from './WordInput';
import { Word, WordCard } from './WordCard';
import { Stack, Typography } from '@mui/material';

const KEY_LOCAL_STORAGE='cards.words';

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
interface SnackBarState {
  open: boolean,
  message: string,
}

interface IProps extends WithStylesProps<typeof styles> {
  children?: React.ReactNode
}

interface WordListProps {
  words: Word[],
  deleteEntry: (name: string) => void,
};

const WordList = (props: WordListProps) => {
  return (
    <Grid container sx={{width: "100%", padding: "40px"}} spacing={2}>
      {props.words.map((word) => {
        return (
          <Grid item xs={3}>
            <WordCard
              word={word}
              deleteEntry={props.deleteEntry}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

const UsageMessage = () => {
  return (
    <Typography>
      Type any key or click the add button below to add new word.
    </Typography>
  );
}

function App(props: IProps) {
  const { classes } = props;
  const [words, setWords] = useState<Word[]>([]);
  const [windowHeight, setWindowHeight] = useState<number>(0);

  const deleteEntry = (name: string) => {
    setWords(words.filter((w) => name !== w.name));
  }

  useEffect(() => {
    const saved = localStorage.getItem(KEY_LOCAL_STORAGE);
    if(saved) {
      setWords(JSON.parse(saved))
    }
    setWindowHeight(window.outerHeight);    
    window.addEventListener('resize', () => {
      setWindowHeight(window.outerHeight);
    });
  }, []);

  const [snState, setSnState] = useState<SnackBarState>({
    open: false,
    message: '',
  });
  const { open, message } = snState;
  const [bdopen, setBdopen] = useState<boolean>(false);

  const handleClose = () => {
    setSnState({ ...snState, open: false });
  }

  useEffect(() => {
    localStorage.setItem(
      KEY_LOCAL_STORAGE, JSON.stringify(words));
  }, [words]);

  const addEntry = (name: string) => {
    if (words.some(w => w.name === name)) {
      setWords(words.map(w => (w.name === name)?({ ...w, cnt: w.cnt+1 }):w));
    } else {
      searchDict(name)
      .then((result) => {
        if (result.status === 200) {
          setWords(words.concat({
            name: name,
            description: result.data,
            cnt: 0
          }));
        } else {
          setWords(words.concat({name: name, cnt: 0}));
        }
      },
      (error) => {
        setSnState({open: true, message: 'APIRequestFailed'});
      });
    }
  };

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
        <WordInput setWord={addEntry} />
      </Backdrop>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}>
          <Alert variant="filled" severity="error">
            {message}
          </Alert>
      </Snackbar>
      { (words.length === 0)
        ? <UsageMessage />
        : <WordList words={words} deleteEntry={deleteEntry}/> }
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
