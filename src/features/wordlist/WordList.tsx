import Grid from '@mui/material/Grid'
import { WordCard } from './WordCard'
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { deleteWord, selectWordList, setWords } from './wordListSlice';
import { useEffect } from 'react';
import { UsageMessage } from '../UsageMessage';

const KEY_LOCAL_STORAGE='cards.words';

export const WordList = () => {
    const words = useAppSelector(selectWordList);
    const dispatch = useAppDispatch();

    useEffect(() => {
      const saved = localStorage.getItem(KEY_LOCAL_STORAGE);
      if(saved) {
        dispatch(setWords(JSON.parse(saved)))
      }
    }, []);

    useEffect(() => {
      localStorage.setItem(
        KEY_LOCAL_STORAGE, JSON.stringify(words));
    }, [words]);

    if (words.length === 0) {
      return <UsageMessage />
    } else {
      return (
        <Grid container sx={{width: "100%", padding: "40px"}} spacing={2}>
        {words.map((word) => {
          return (
            <Grid item xs={3}>
              <WordCard
                word={word}
                deleteEntry={(name: string) => dispatch(deleteWord(name))}
              />
            </Grid>
          );
        })}
      </Grid>)
    }
}