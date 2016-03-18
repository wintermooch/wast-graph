const tape = require('tape')
const AST = require('../')

tape('should parse ast', function (t) {
  const json = require('./fixture.json')
  const ast = new AST(json)
  t.deepEqual(ast.toJSON(), json)
  t.end()
})
