import { DictEntry } from "./freedictapi"

export interface Word {
    name: string,
    description?: DictEntry[],
    cnt: number
}