const e = require('./eval')

const env = {
  '+': ([...vals]) => vals.reduce((a, b) => a + b, 0),
  '-': ([...vals]) => {
    if(vals.length < 2) {
      return vals.reduce((a, b) => a - b, 0)
    } else {
      return vals.reduce((a, b) => a - b)
    }
  },
  '*': ([...vals]) => vals.reduce((a, b) => a * b, 1),
  '/': ([...vals]) => vals.reduce((a, b) => a / b, 1),
  or: ([...vals]) => vals.reduce((a, b) => a || b, null),
  and: ([...vals]) => {
    if(vals.length == 1) {
      return vals[0]
    } else {
      return vals.reduce((a, b) => a && b)
    }
  },
  str: ([...vals]) => vals.reduce((a, b) => a + b.toString(), "")
}

const evaluate = (string) => e.evaluate(string, env)

module.exports = {env, evaluate}
