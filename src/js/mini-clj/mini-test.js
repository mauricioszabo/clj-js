const core = require('./core')
const e = require('./eval')

function evalElem([is, body], vars) {
  if(is.name !== 'is') {
    throw new Error(`Arguments for deftest should be "is", found "${is.name}"`)
  }
  const [matcher, expectedEdn, actualEdn] = body.val
  const expected = e.evalEdn(expectedEdn, vars)
  const actual = e.evalEdn(actualEdn, vars)

  switch(matcher.name) {
  case '=':
    return vars.__commands.expect(actual).toEqual(expected)
  case '==':
    return vars.__commands.expect(actual).toBe(expected)
  default:
    throw new Error(`Don't know which matcher is ${matcher.name}`)
  }
  console.log('matcher', expected, matcher, actual)
}

const env = (() => {
  const newEnv = Object.create(core.env)
  const deftest = ([name, ...body], vars) => {
    vars[name.name] = () => {
      body.forEach(elem => evalElem(elem.val, vars))
    }
  }
  deftest.macro = true
  newEnv.deftest = deftest

  newEnv.is = ([match]) => {
    console.log(match)
    const [m, expected, actual] = match.val
    console.log(m, expected, actual)
  }
  return newEnv
})()

const evaluate = (string, commands) => {
  env.__commands = commands
  e.evaluate(string, env)
}
module.exports = {evaluate}
