'use strict'
const tape = require('tape')
const parser = require('wast-parser')
const AST = require('../')

tape('basic', (t) => {
  const blockJSON = {
    'kind': 'block',
    'id': null,
    'body': [{
      'kind': 'identifier',
      'id': 'gasAdd'
    }]
  }
  const graph = new AST(blockJSON)
  t.equal(graph.isLabeled, true, 'isLabeled should work')
  t.equal(graph.isBranch, false, 'isBranch should work')
  t.end()
})

tape('should parse ast', function (t) {
  const json = require('./fixture.json')
  const ast = new AST(json)
  t.deepEqual(ast.toJSON(), json)
  t.end()
})

tape('should unsift edge', (t) => {
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
  body.unshift(json)

  t.deepEquals(block.toJSON(), expected)
  const copy = block.copy()
  t.deepEquals(copy.toJSON(), expected)

  t.end()
})

tape('should unshift edge that is already an ast', (t) => {
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
  body.unshift(new AST(json))

  t.deepEquals(block.toJSON(), expected)
  t.end()
})

tape('should unshift edge to a body that is not empty', (t) => {
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
  body.unshift(new AST(json))

  t.deepEquals(block.toJSON(), expected)
  t.end()
})

tape('should push edge', (t) => {
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
      'kind': 'identifier',
      'id': 'gasAdd'
    }, {
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
  body.push(new AST(json))

  t.deepEquals(block.toJSON(), expected)
  t.end()
})

tape('should push edge that is not AST instance', (t) => {
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
      'kind': 'identifier',
      'id': 'gasAdd'
    }, {
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
  body.push(json)

  t.deepEquals(block.toJSON(), expected)
  t.end()
})

tape('should return import table', (t) => {
  const wast =
    `(module
      (import "spectest" "print" (param i32))
      (func)
      (export "fac-rec" 0)
      (import "spectest" "print" (param i32))
    )`

  const json = parser.parse(wast)
  const ast = new AST(json)
  const importTable = ast.importTable
  t.equals(importTable.length, 2)
  t.end()
})
