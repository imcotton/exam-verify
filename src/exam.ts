import { pipe } from 'fp-ts/function'





type Flag
    = 'G'   // 🟩 Green
    | 'Y'   // 🟨 Yellow
    | 'D'   // ⬛ Dark

type FlagArr = ReadonlyArray<Flag>

type CharArr = ReadonlyArray<string>





export const exam = (_quiz: CharArr, _attempt: CharArr): FlagArr => pipe(

    [ ...'T.B.D' ] as FlagArr

)

