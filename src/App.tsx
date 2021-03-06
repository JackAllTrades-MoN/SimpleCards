import React, { useEffect, useState, useRef } from 'react'

import Backdrop from '@mui/material/Backdrop'
import Fab from '@mui/material/Fab'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import AddIcon from '@mui/icons-material/Add'
import Stack from '@mui/material/Stack'
import withStyles, {WithStylesProps} from 'react-jss'
import { WordInput } from './features/WordInput'
import { Notification } from './features/notification/Notification'
import { WordList } from './features/wordlist/WordList'
import { useAppSelector, useAppDispatch } from './app/hooks'
import { selectWordList, setWords } from './features/wordlist/wordListSlice'

const styles = {
  app: {
    padding: "20px",
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
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const words = useAppSelector(selectWordList);
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWindowHeight(window.outerHeight);    
    window.addEventListener('resize', () => {
      setWindowHeight(window.outerHeight);
    });
  }, []);

  const [bdopen, setBdopen] = useState<boolean>(false);

  const closeBackDrop = () => {
    setBdopen(false);
    (document.activeElement as HTMLElement)?.blur();
    document.getElementById('app-main')?.focus();
  };

  const openBackDrop = () => {
    setBdopen(true)
  };

  const downloadJson = async () => {
    const blob = new Blob([JSON.stringify(words)], {type:'application/json'});
    const link = document.createElement('a');
    link.href = await URL.createObjectURL(blob);
    link.download = 'words.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const uploadJson = () => {
    inputRef.current?.click()
  }

  const readFileAsync = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    })
  }

  const onFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files) {
      try {
        const buff = await readFileAsync(event.target?.files[0]);
        dispatch(setWords(JSON.parse(buff)))
      } catch(err) {
        console.log(err)
      }
    }
  }

  return (
    <div
      id="app-main"
      tabIndex={-1}
      className={classes.app}
      onKeyDown={openBackDrop}
      style={{height: windowHeight}}
    >
      <Backdrop
        open={bdopen}
        onClick={closeBackDrop}
      >
        <WordInput isVisible={bdopen} />
      </Backdrop>
      <Notification />
      <WordList />
      <Stack direction="row" spacing={2} className="btns">
        <Fab color="secondary" onClick={downloadJson}>
          <DownloadIcon />
        </Fab>
        <Fab color="secondary" onClick={uploadJson}>
          <UploadIcon />
          <input
            hidden
            ref={inputRef}
            type="file"
            onChange={onFileInputChange}/>
        </Fab>
        <Fab color="primary" onClick={openBackDrop}>
          <AddIcon />
        </Fab>
      </Stack>
    </div>
  );
}

export default withStyles(styles)(App);
