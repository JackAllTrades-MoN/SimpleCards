import React, {useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import withStyles, {WithStylesProps} from 'react-jss';
import { DictEntry, searchDict } from './api';
import { Toolbar } from '@mui/material';

const KEY_LOCAL_STORAGE='cards.words';

const styles = {
  app: {
//    height: "100vh",
//    'background-color': '#343434',
//    padding: "0px",
    "& .logo-text": {
      'font-family': "'Baloo Tamma', cursive",
      textAlign: 'center',
      width: '100%',
      color: 'white',
      fontSize: '30px',
      letterSpacing: '2px',
      textShadow: `-1px -1px 0px blue, 3px 3px 0px blue, 6px 6px 0px blue`,
    },
    "& .word-input": {
//      width: '100%',
    }
  },
};

interface Word {
  name: string,
  description?: DictEntry[],
  cnt: number
}

interface WordInputProps {
  setWord: (word: string) => void,
}

interface WordCardProps {
  word: Word,
  deleteEntry: (name: string) => void,
}

const WordCard = (props: WordCardProps) => {
  const descr = props.word.description?.map(
    entry => <div>
      {entry.meanings.map(meaning => <div>
        {`(${meaning.partOfSpeech})`}<br />
        {meaning.definitions.map(ddef => <div>
          {`- ${ddef.definition}`}<br />
          {`e.g., ${ddef.example}`}
        </div>)}
      </div>)}
    </div>
  );
  return (
    <Tooltip title={ descr || 'NotFound' }>
      <Card sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box>
          <CardContent>
            <Typography>
              { `${props.word.name} (${props.word.cnt})` }
            </Typography>
          </CardContent>          
        </Box>
        <Box sx={{ backgroundColor: '#f8d7d9' }}>
          <CardContent>
            <IconButton
              onClick={() => props.deleteEntry(props.word.name)} >
              <HighlightOffIcon />
            </IconButton>
          </CardContent>
        </Box>
      </Card>
    </Tooltip>
  );
}

const WordInput = (props: WordInputProps) => {
  const [value, setValue] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if(e.key === 'Enter') {
      props.setWord(value);
      setValue('');
    }
  }
  return (
    <TextField
      className="word-input"
      onChange={handleChange}
      onKeyDown={onKeyDown}
      value={value}
      variant="outlined"
      label="enter your word" />
  );
}

interface SnackBarState {
  open: boolean,
  message: string,
}

interface IProps extends WithStylesProps<typeof styles> {
  children?: React.ReactNode
}

function App(props: IProps) {
  const { classes } = props;
  const [words, setWords] = useState<Word[]>([]);
  const [snState, setSnState] = useState<SnackBarState>({
    open: false,
    message: '',
  });
  const { open, message } = snState;

  const handleClose = () => {
    setSnState({ ...snState, open: false });
  }

  const deleteEntry = (name: string) => {
    setWords(words.filter((w) => name !== w.name));
  }

  useEffect(() => {
    const saved = localStorage.getItem(KEY_LOCAL_STORAGE);
    if(saved) {
      setWords(JSON.parse(saved))
    }
  }, []);

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
    <div className={classes.app}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            sx={{ mr: 2}}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          SimpleCards
        </Typography>
        <WordInput setWord={addEntry} />
      </AppBar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={handleClose}>
          <Alert variant="filled" severity="error">
            {message}
          </Alert>
      </Snackbar>
      <Grid container spacing={2}>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={9} sx={{marginTop: '25px'}}>
          <Grid container spacing={2}>
            {words.map((word) => {
              return (
                <Grid item xs={3}>
                  <WordCard
                    word={word}
                    deleteEntry={deleteEntry}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(App);
