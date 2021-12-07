import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from '../app/hooks';
import { addWord } from './wordlist/wordListSlice';

interface WordInputProps {
  isVisible: boolean,
}
  
export const WordInput = (props: WordInputProps) => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<string>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };
    const onKeyDown = (e: React.KeyboardEvent) => {
      if(e.key === 'Enter') {
        if(value !== '') {
          dispatch(addWord(value));
          setValue('');
        }
      }
    };
    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };
    useEffect(() => {
      setValue('')
      if(props.isVisible) {
        document.getElementById("word-input")?.focus()
      }
    }, [props.isVisible])
    return (
      <TextField
        id="word-input"
        className="word-input"
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onClick={onClick}
        value={value}
        variant="outlined"
        label="enter your word" />
    );
};