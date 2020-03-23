const {evaluate} = require('../../../src/js/mini-clj/mini-test')

describe('mini-clojure test framework', () => {
  test('it adds a var to test things', () => {
    expect(evaluate(
      `(deftest some-test
          (is (== 20 20))
          (is (= :foo :foo)))
       (some-test)`,
       {test, expect}
    )).toBe(undefined) // errors will go to test
  })
})
