const {evaluate} = require('../../../src/js/mini-clj/core')
// const {evaluate} = require('../../../src/js/mini-clj/eval')
const edn = require('jsedn')

describe('MiniClj interpreter', () => {
  test('arithmetics work', () => {
    expect(evaluate('(+ 1 2)')).toBe(3)
    expect(evaluate('(- 2)')).toBe(-2)
    expect(evaluate('(- 1 2)')).toBe(-1)
    expect(evaluate('(- 1 2 1)')).toBe(-2)
    expect(evaluate('(* 1 2)')).toBe(2)
    expect(evaluate('(/ 1 2)')).toBe(0.5)
  })

  test('concatenates strings', () => {
    expect(evaluate('(str "Foo" 10)')).toBe("Foo10")
  })

  test('booleans', () => {
    expect(evaluate('(or false 20)')).toBe(20)
    expect(evaluate('(and false 20)')).toBe(false)
  })
})
