import { Window } from 'happy-dom'

const window = new Window()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).document = window.document
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).window = window
