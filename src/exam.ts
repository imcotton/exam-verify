import {
    readonlyArray as A,
    option as O,
    state as S,
    string as Str,
} from 'fp-ts'

import {
    flow,
    pipe,
} from 'fp-ts/function'





type Flag
    = 'G'   // 🟩 Green
    | 'Y'   // 🟨 Yellow
    | 'D'   // ⬛ Dark

type FlagArr = ReadonlyArray<Flag>

type CharArr = ReadonlyArray<string>





export const exam = (quiz: CharArr, attempt: CharArr): FlagArr => pipe(

    A.zip(quiz, attempt),

    S.traverseReadonlyArrayWithIndex((i, [ q, a ]) => a === q
        ? S.modify(mark(i))
        : S.of<CharArr, string | void>(a)
    ),

    S.chain(S.traverseArray(a => a == null
        ? flag('G')
        : pipe(
            S.gets(flow(
                A.findIndex<string>(s => s === a),
                O.map(i => S.modify(mark(i))),
            )),
            S.chain(O.match(
                () => flag<CharArr>('D'),
                S.apSecond(flag('Y')),
            )),
        )
    )),

    S.evaluate(quiz),

)





const flag = <T> (f: Flag) => S.of<T, Flag>(f)





const update_by = <T> (v: T) => (i: number) => (arr: ReadonlyArray<T>) => pipe(
    arr,
    A.updateAt(i, v),
    O.getOrElse(() => arr),
)

const mark = update_by(Str.empty)

