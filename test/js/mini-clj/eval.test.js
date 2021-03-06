const {evaluate, load} = require('../../../src/js/mini-clj/eval')
const edn = require('jsedn')

describe('evaluation of MiniClj', () => {
  test('evaluate literals', () => {
    expect(evaluate('4')).toBe(4)
    expect(evaluate(':foo')).toEqual(new edn.Keyword(':foo'))
  })

  test('if special form', () => {
    const ifTrue = evaluate('(if true 4 5)')
    const ifFalse = evaluate('(if false 4 5)')
    const ifNil = evaluate('(if nil 4 5)')

    expect(ifTrue).toBe(4)
    expect(ifFalse).toBe(5)
    expect(ifNil).toBe(5)
  })

  test('let special form', () => {
    expect(
      evaluate('(let [a 10] 20 a)')
    ).toBe(10)
  })

  test('def special form', () => {
    expect(
      evaluate('(def a 10) a')
    ).toBe(10)
  })

  test('fn special form', () => {
    expect(
      evaluate('((fn [a] a) 20)')
    ).toBe(20)
  })

  test('defn special form', () => {
    expect(
      evaluate('(defn afn [p] p) (afn 10)')
    ).toBe(10)
  })

  test('load source and return an env', () => {
    const env = load("(defn second [a b] b)")
    expect(evaluate("(second 1 2)", env)).toBe(2)
  })

  test('collections should evaluate', () => {
    expect(evaluate('(let [a 10] [a a])')).toEqual(edn.parse('[10 10]'))
    expect(evaluate('(let [a 10 b 20] {a b})')).toEqual(edn.parse('{10 20}'))
  })
})
