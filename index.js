'use strict'
const Graph = require('generic-digraph')

const visitorKeys = {
  binop: ['left', 'right'],
  block: ['body'],
  br: ['id', 'expr'],
  br_if: ['id', 'test', 'expr'],
  br_table: ['expr', 'body'],
  call: ['id', 'expr'],
  call_import: ['id', 'expr'],
  call_indirect: ['id', 'expr'],
  const: [],
  cvtop: ['expr'],
  else: ['id', 'body'],
  export: ['id'],
  failure: [],
  func: ['id', 'param', 'result', 'body'],
  get_local: ['id'],
  grow_memory: ['expr'],
  identifier: [],
  if: ['test', 'consequent', 'alternate'],
  import: ['id', 'params'],
  invoke: ['body'],
  item: [],
  literal: [],
  load: ['expr'],
  local: ['items'],
  loop: ['body', 'extra'],
  memory: ['segment'],
  memory_size: [],
  module: ['body'],
  nop: [],
  param: ['items'],
  relop: ['left', 'right'],
  result: [],
  return: ['expr'],
  script: ['body'],
  segment: [],
  select: ['test', 'consequent', 'alternate'],
  set_local: ['id', 'init'],
  start: ['id'],
  store: ['addr', 'data'],
  table: ['items'],
  then: ['id', 'body'],
  type: ['id'],
  unop: ['expr'],
  unreachable: []
}

module.exports = class AST extends Graph {
  constructor (json) {
    super()
    if (json) {
      this.parse(json)
    }
  }

  parse (json) {
    if (Array.isArray(json)) {
      this._value = {
        array: true
      }

      if (json.length) {
        json = json.slice(0)
        const self = this
        json.forEach((el, i) => {
          self.setEdge(i, el)
        })
      }
    } else {
      json = Object.assign({}, json)
      const branches = visitorKeys[json.kind]
      const self = this
      branches.forEach(function (br) {
        self.setEdge(br, json[br])
        delete json[br]
      })
      this._value = json
    }
  }

  toJSON () {
    let value = this.getValue()
    if (this.edges.size) {
      if (value.array) {
        value = []
        for (const el of this.edges) {
          value.push(el[1].toJSON())
        }
      } else {
        for (const el of this.edges) {
          value[el[0]] = el[1].toJSON()
        }
      }
    } else if (!value) {
      return null
    } else if (value.array) {
      return []
    }
    return value
  }

  unshiftEdge (edge) {
    if (!(edge instanceof AST)) {
      edge = new AST(edge)
    }

    const edges = [...this.edges]
    edges.map((i) => {
      i[0]++
      return i
    })
    edges.unshift([0, edge])
    this._edges = new Map(edges)
  }
}
