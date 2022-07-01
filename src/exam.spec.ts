import {
    describe as desc,
    test,
    expect,
} from 'vitest'

import {
    io as IO,
    string as Str,
    readonlyArray as A,
    monoid as M,
} from 'fp-ts'

import {
    flow,
    pipe,
    constVoid,
} from 'fp-ts/function'

import {
    exam,
} from './exam.js'





type RA <T> = ReadonlyArray<T>





const on =
    <B, C> (f: (..._: [ B, B ]) => C) =>
        <A> (g: (_: A) => B) =>
            (x: A, y: A): C =>
                f(g(x), g(y))





const string_concat_all = M.concatAll(Str.Monoid)





const exam_str = flow(
    on (exam) (flow(
        Str.trim,
        Array.from as <T> (_: Iterable<T>) => RA<T>,
    )),
    string_concat_all,
)





const describe = desc.skipIf(exam_str('To', 'Do') === 'T.B.D')





const refine = flow(
    Str.replace(/\+/g, 'G'),
    Str.replace(/\^/g, 'Y'),
    Str.replace(/\./g, 'D'),
)





const margin = (n: number) => (l: string) => (r: string) => string_concat_all([
    ' '.repeat(n),
    l, r,
    ' '.repeat(n),
])





const label = (
        position: 'q' | 'a',
        { q, a, f }: Record<'q' | 'a' | 'f', RA<string>>,
) => pipe(

    A.zip(A.zip(q, a), f),

    IO.traverseArray(([ [ q_, a_ ], f_ ]) => () => {

        const m3 = margin(3)
        const ma = m3 ('A:  ') (a_)
        const mf = m3 ('∴   ')
        const mq = m3 ('Q:  ') (q_)

        test(position === 'q' ? q_ : a_, () => {

            expect(
                [ ma,   mf(exam_str(q_, a_)),   mq ]
            ).toStrictEqual(
                [ ma,   mf(refine(f_)),         mq ]
            )

        })

    }),

    IO.map(constVoid),

)





const s2a = ([ head = '' ]: RA<string>) => pipe(
    Str.trim(head),
    Str.split(/\s+/),
)





describe('three b one b', label('q', {

    // https://www.youtube.com/watch?v=fRed0Xmc2Wg&t=30s

    a: s2a`   speed   speed   speed   speed   `,
    f: s2a`   ..^.^   ^.^^.   +.+..   .^+^.   `,
    q: s2a`   abide   erase   steal   crepe   `,

}))

describe('m0i5t', label('a', {

    a: s2a`   shims   dooms   `,
    f: s2a`   ^.+^.   .+.^^   `,
    q: s2a`   moist   moist   `,

}))

describe('abbey', label('a', {

    a: s2a`   kebab   abate   babes   `,
    f: s2a`   .^+^^   ++..^   ^^++.   `,
    q: s2a`   abbey   abbey   abbey   `,

}))

describe('p____', label('q', {

    a: s2a`   preen   proof   soppy   `,
    f: s2a`   +^.+.   +++..   ..^..   `,
    q: s2a`   payer   proxy   pleat   `,

}))

describe('etc.', label('q', {

    a: s2a`   otter   agger   `,
    f: s2a`   ++.++   .^.^.   `,
    q: s2a`   other   dodge   `,

}))

