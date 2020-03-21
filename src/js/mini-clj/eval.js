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

function evalFn([argSymbols, ...body], vars) {
  const params = argSymbols.val;
  const newVars = Object.create(vars)

  return (args) => {
    for(let i = 0; i < params.length; i++) {
      newVars[params[i].name] = args[i]
    }
    return evalEdn(body, newVars)
  }
}

function fnCall([sym, ...args], vars) {
  switch(sym.ednEncode()) {
  case 'def':
    vars[args[0].name] = evalEdn(args[1], vars)
    return
  case 'fn':
    return evalFn(args, vars)
  case 'if':
    if(isTrue(evalEdn(args[0], vars))) {
      return evalEdn(args[1], vars)
    } else {
      return evalEdn(args[2], vars)
    }
  case 'let':
    return evalLet(args, vars)
  default:
    const fn = evalEdn(sym, vars)
    const params = args.map(p => evalEdn(p, vars))
    return fn(params)
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
  const parsed = edn.parse(`[${string}\n]`)
  return evalEdn(parsed.val, {})
}

module.exports = {evaluate}
