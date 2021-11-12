
export interface DictEntry {
    meanings: DictMeaning[]
}

export interface DictMeaning {
    partOfSpeech: string,
    definitions: DictDefinition[]
}

export interface DictDefinition {
    definition: string,
    example: string,
}

export const searchDict = (word: string) => 
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(r => r.json().then((data: DictEntry[]) => ({status: r.status, data: data})));