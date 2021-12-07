import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState, AppThunk } from '../../app/store'
import { searchDict } from '../../common/freedictapi'
import { showError } from '../notification/notificationSlice'
import { Word } from '../../common/word'

interface WordListState {
    words: Word[],
}

const initialState: WordListState = {
    words: []
}

export const wordListSlice = createSlice({
    name: 'wordlist',
    initialState,
    reducers: {
        deleteWord: ({words}, action: PayloadAction<string>) => (
            { words: words.filter((w) => action.payload !== w.name) }
        ),
        insertWord: ({words}, action: PayloadAction<Word>) => (
            { words: words.concat(action.payload) }
        ),
        countUp: ({words}, action: PayloadAction<string>) => (
            { words: words.map(w =>
                (w.name === action.payload)?({ ...w, cnt: w.cnt+1 }):w)}
        ),
        setWords: (state_, action:PayloadAction<Word[]>) => (
            { words: action.payload }
        )
    }
})

export const { deleteWord, setWords } = wordListSlice.actions

export const addWord = (name: string): AppThunk =>
    (dispatch, getState) => {
        const {words} = getState().wordlist;
        if(words.some(w => w.name === name)) {
            dispatch(wordListSlice.actions.countUp(name))
        } else {
            searchDict(name)
            .then((result) => {
                if (result.status === 200) {
                    dispatch(wordListSlice.actions.insertWord(
                        {
                            id: words.reduce((a, b) => Math.max(a, b.id), 0) + 1,
                            name: name,
                            description: result.data,
                            cnt: 0
                        }
                    ))
                } else {
                    dispatch(wordListSlice.actions.insertWord(
                        {
                            id: words.reduce((a, b) => Math.max(a, b.id), 0) + 1,
                            name: name,
                            cnt: 0
                        }
                    ))
                }
            },
            (error) => {
                dispatch(showError('APIRequestFailed'))
            })
        }
    }

export const selectWordList = (state: RootState) => state.wordlist.words

export default wordListSlice.reducer