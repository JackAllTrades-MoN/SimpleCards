import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

interface WordInputProps {
    setWord: (word: string) => void,
}
  
export const WordInput = (props: WordInputProps) => {
    const [value, setValue] = useState<string>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };
    const onKeyDown = (e: React.KeyboardEvent) => {
      if(e.key === 'Enter') {
        props.setWord(value);
        setValue('');
      }
    };
    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };
    return (
      <TextField
        className="word-input"
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onClick={onClick}
        value={value}
        variant="outlined"
        label="enter your word" />
    );
};