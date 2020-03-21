const edn = require('jsedn')

const isTrue = edn => !(edn === false || edn === null)

function evalLet([bindings, ...body], vars) {
  const newVars = Object.create(vars)
  const binds = bindings.val
  for(let i = 0; i < binds.length / 2; i += 2) {
    const res = evalEdn(binds[i+1], newVars)
    newVars[binds[i].name] = res
  }
  return evalEdn(body, newVars)
}

function fnCall([sym, ...args], vars) {
  switch(sym.ednEncode()) {
  case 'if':
    if(isTrue(evalEdn(args[0], vars))) {
      return evalEdn(args[1], vars)
    } else {
      return evalEdn(args[2], vars)
    }
  case 'let':
    return evalLet(args, vars)
  }
}

const evalSymbol = (symbolName, vars) =>
  vars[symbolName]

function evalEdn(parsed, vars) {
  if(parsed instanceof edn.List) {
    return fnCall(parsed.val, vars)
  } else if(parsed instanceof edn.Keyword) {
    return parsed
  } else if(parsed instanceof edn.Symbol) {
    return evalSymbol(parsed.toString(), vars)
  } else if(parsed instanceof Array) {
    const results = parsed.map(e => evalEdn(e, vars))
    return results[results.length - 1]
  } else {
    return parsed
  }
}

function evaluate(string) {
  const parsed = edn.parse(string)
  return evalEdn(parsed, {})
}

module.exports = {evaluate}
