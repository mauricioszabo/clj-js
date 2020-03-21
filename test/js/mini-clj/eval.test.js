const {evaluate} = require('../../../src/js/mini-clj/eval')
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
})
