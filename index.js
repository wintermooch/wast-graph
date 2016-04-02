'use strict'
const Graph = require('generic-digraph')
const topoKeys = require('wast-spec/lib/visitor-keys.json')
const schemas = require('./schemas.json')

const branches = new Set(['br', 'br_table'])

module.exports = class AST extends Graph {
  constructor (json) {
    super()
    if (typeof json === 'string') {
      const key = json
      json = schemas[key]
      json.kind = key
    }
    this.parse(json)
  }

  /**
   * the node type
   */
  get kind () {
    return this._value.kind
  }

  /**
   * whether or not the current node can branch
   */
  get isBranch () {
    return branches.has(this.kind)
  }

  /**
   * returns a copy of the AST
   */
  copy () {
    return new this.constructor(this.toJSON())
  }

  /**
   * parse a wasm json AST
   * @param {object} json
   */
  parse (json) {
    if (Array.isArray(json)) {
      this._value = {
        kind: 'array'
      }

      if (json.length) {
        json = json.slice(0)
        const self = this
        json.forEach((el, i) => {
          self.set(i, el)
        })
      }
    } else {
      json = Object.assign({}, json)
      const branches = topoKeys[json.kind]
      const self = this
      branches.forEach(function (br) {
        const jsonbr = json[br]
        if (jsonbr) {
          self.set(br, json[br])
        }
        delete json[br]
      })
      this._value = json
    }
  }

  toJSON () {
    let value = this.getValue()
    if (value.kind !== 'array') {
      const topo = topoKeys[value.kind]
      for (const el of topo) {
        value[el] = null
      }

      for (const el of this.edges) {
        value[el[0]] = el[1].toJSON()
      }
    } else {
      value = []
      for (const el of this.edges) {
        value.push(el[1].toJSON())
      }
    }
    return value
  }

  /**
   * similar to `Array.unshift`. Adds a node to the begining of an 'array'
   * of edges
   * @param {object} node
   */
  unshift (node) {
    if (!(node instanceof AST)) {
      node = new AST(node)
    }

    const edges = [...this.edges]
    edges.map((i) => {
      i[0]++
      return i
    })

    edges.unshift([0, node])
    this._edges = new Map(edges)
  }

  /**
   * inserts an node into an `array` kind at a given index
   * @param {integer} index
   * @param {AST} node
   */
  insertAt (index, node) {
    if (!(node instanceof AST)) {
      node = new AST(node)
    }

    const edges = [...this.edges]
    edges.splice(index, 0, [index, node])
    edges.slice(index + 1).forEach((el) => ++el[0])
    this._edges = new Map(edges)
  }

  /**
   * similar to `Array.push`. Adds ordered edge to the end of a array of edges
   * @param {object} edge
   */
  push (node) {
    if (!(node instanceof AST)) {
      node = new AST(node)
    }
    this._edges.set(this._edges.size, node)
  }

  get importTable () {
    return [...this].filter((vertex) => vertex[1].kind === 'import')
  }
}
