const parser = require('wast-parser')
const AST = require('../')

const wast =
    `(module
        (table 0)
        (func $run (param i64)
        (local $i32 i32) (local $i64 i64) (local $f32 f32) (local $f64 f64)
        (local i32 i32 i32)
        (call_import $print_i32 (set_local $i32 (i32.const 1)))
        (call_import $print_i64 (set_local $i64 (i64.const 2)))
        (call_import $print_f32 (set_local $f32 (f32.const 3)))
        (call_import $print_f64 (set_local $f64 (f64.const 4)))

        (call_import $print_i32 (i32.store (i32.const 0) (i32.const 11)))
        (call_import $print_i64 (i64.store (i32.const 0) (i64.const 12)))
        (call_import $print_f32 (f32.store (i32.const 0) (f32.const 13)))
        (call_import $print_f64 (f64.store (i32.const 0) (f64.const 14)))

        (call_import $print_i32 (i32.store8 (i32.const 0) (i32.const 512)))
        (call_import $print_i32 (i32.store16 (i32.const 0) (i32.const 65536)))
        (call_import $print_i64 (i64.store8 (i32.const 0) (i64.const 512)))
        (call_import $print_i64 (i64.store16 (i32.const 0) (i64.const 65536)))
        (call_import $print_i64 (i64.store32 (i32.const 0) (i64.const 4294967296)))
    )
    (export "run" $run))`

const json = parser.parse(wast)
console.log(JSON.stringify(json, null, 2))

const ast = new AST(json)
const it = ast.iterate({
  accumulate: function * (name, vertex) {
    if (vertex.kind === 'item') {
      yield vertex
    }
  }
})

console.log([...it].length)
