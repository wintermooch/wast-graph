const tape = require('tape')
const AST = require('../')

tape('should parse ast', function (t) {
  const json = require('./fixture.json')
  const ast = new AST(json)
  t.deepEqual(ast.toJSON(), json)
  t.end()
})

tape('should push edge', function (t) {
  const json = {
    'kind': 'call_import',
    'id': {
      'kind': 'identifier',
      'id': 'gasAdd'
    },
    'expr': [{
      'kind': 'const',
      'type': 'i32',
      'init': 9
    }]
  }

  const blockJSON = {
    'kind': 'block',
    'id': null,
    'body': []
  }

  const expected = {
    'kind': 'block',
    'id': null,
    'body': [{
      'kind': 'call_import',
      'id': {
        'kind': 'identifier',
        'id': 'gasAdd'
      },
      'expr': [{
        'kind': 'const',
        'type': 'i32',
        'init': 9
      }]
    }]
  }

  const block = new AST(blockJSON)
  const body = block.getEdge('body')
  body.unshiftEdge(json)

  t.deepEquals(block.toJSON(), expected)
  t.end()
})

tape('should push edge that is already an ast', function (t) {
  const json = {
    'kind': 'call_import',
    'id': {
      'kind': 'identifier',
      'id': 'gasAdd'
    },
    'expr': [{
      'kind': 'const',
      'type': 'i32',
      'init': 9
    }]
  }

  const blockJSON = {
    'kind': 'block',
    'id': null,
    'body': []
  }

  const expected = {
    'kind': 'block',
    'id': null,
    'body': [{
      'kind': 'call_import',
      'id': {
        'kind': 'identifier',
        'id': 'gasAdd'
      },
      'expr': [{
        'kind': 'const',
        'type': 'i32',
        'init': 9
      }]
    }]
  }

  const block = new AST(blockJSON)
  const body = block.getEdge('body')
  body.unshiftEdge(new AST(json))

  t.deepEquals(block.toJSON(), expected)
  t.end()
})

tape('should push edge to a body that is not empty', function (t) {
  const json = {
    'kind': 'call_import',
    'id': {
      'kind': 'identifier',
      'id': 'gasAdd'
    },
    'expr': [{
      'kind': 'const',
      'type': 'i32',
      'init': 9
    }]
  }

  const blockJSON = {
    'kind': 'block',
    'id': null,
    'body': [{
      'kind': 'identifier',
      'id': 'gasAdd'
    }]
  }

  const expected = {
    'kind': 'block',
    'id': null,
    'body': [{
      'kind': 'call_import',
      'id': {
        'kind': 'identifier',
        'id': 'gasAdd'
      },
      'expr': [{
        'kind': 'const',
        'type': 'i32',
        'init': 9
      }]
    }, {
      'kind': 'identifier',
      'id': 'gasAdd'
    }]
  }

  const block = new AST(blockJSON)
  const body = block.getEdge('body')
  body.unshiftEdge(new AST(json))

  t.deepEquals(block.toJSON(), expected)
  t.end()
})

