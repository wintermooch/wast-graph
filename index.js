'use strict'
const Graph = require('generic-digraph')
const topoKeys = require('wast-spec/lib/visitor-keys.json')

const branches = new Set(['br', 'br_table'])
const labeled = new Set(['block'])

module.exports = class AST extends Graph {
  constructor (json) {
    super()
    this.parse(json)
  }

  get kind () {
    return this._value.kind
  }

  get isBranch () {
    return branches.has(this.kind)
  }

  get isLabeled () {
    return labeled.has(this.kind)
  }

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
        array: true,
        kind: null
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
    if (value.kind) {
      const topo = topoKeys[value.kind]
      for (const el of topo) {
        value[el] = null
      }
    }

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
    return value
  }

  /**
   * similar to `Array.unshift`. Adds ordered edge to the beginging of a array
   * of edges
   * @param {object} edge
   */
  unshift (edge) {
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

  insertAt (edge, index) {
    if (!(edge instanceof AST)) {
      edge = new AST(edge)
    }

    const edges = [...this.edges]
    edges.splice(index, 0, [index, edge])
    edges.slice(index).forEach((el) => ++el[0])
    return new Map(edges)
  }

  /**
   * similar to `Array.push`. Adds ordered edge to the end of a array of edges
   * @param {object} edge
   */
  push (edge) {
    if (!(edge instanceof AST)) {
      edge = new AST(edge)
    }
    this._edges.set(this._edges.size, edge)
  }

  get importTable () {
    return [...this].filter((vertex) => vertex[1].kind === 'import')
  }


  create (type) {
     
  }
}
