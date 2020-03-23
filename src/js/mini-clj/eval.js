const edn = require('jsedn')

const isTrue = edn => !(edn === false || edn === null)

function evalLet([bindings, ...body], vars) {
  const newVars = Object.create(vars)
  const binds = bindings.val
  for(let i = 0; i < binds.length; i += 2) {
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
  case 'defn':
    const [name, ...fnPart] = args
    vars[name.name] = evalFn(fnPart, vars)
    return
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
    if(fn.macro) {
      return fn(args, vars)
    } else {
      const params = args.map(p => evalEdn(p, vars))
      return fn(params)
    }
  }
}

const evalSymbol = (symbolName, vars) => {
  const val = vars[symbolName]
  if(val === undefined) {
    throw new Error(`Var "${symbolName}" is not defined`)
  }
  return val
}

function evalEdn(parsed, vars) {
  if(parsed instanceof edn.List) {
    return fnCall(parsed.val, vars)
  } else if(parsed instanceof edn.Vector) {
    return new edn.Vector(parsed.val.map(e => evalEdn(e, vars)))
  } else if(parsed instanceof edn.Map) {
    parsed.keys = parsed.keys.map(e => evalEdn(e, vars))
    parsed.vals = parsed.vals.map(e => evalEdn(e, vars))
    return parsed
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

function evaluate(string, env={}) {
  const parsed = edn.parse(`[${string}\n]`)
  return evalEdn(parsed.val, env)
}

function load(string, env={}) {
  const newEnv = Object.create(env)
  evaluate(string, newEnv)
  return newEnv
}

module.exports = {evaluate, load, evalEdn}
