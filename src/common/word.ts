import { DictEntry } from "./freedictapi"

export interface Word {
    id: number,
    name: string,
    description?: DictEntry[],
    cnt: number
}