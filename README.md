# SYNOPSIS 
[![NPM Package](https://img.shields.io/npm/v/wast-graph.svg?style=flat-square)](https://www.npmjs.org/package/wast-graph)
[![Build Status](https://img.shields.io/travis/wanderer/wast-graph.svg?branch=master&style=flat-square)](https://travis-ci.org/wanderer/wast-graph)
[![Coverage Status](https://img.shields.io/coveralls/wanderer/wast-graph.svg?style=flat-square)](https://coveralls.io/r/wanderer/wast-graph)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)  

A module for manipulating webassembly's ast. It uses the [AST JSON format](https://github.com/drom/wast-spec) produce by [wast-parser](https://github.com/drom/wast-parser).

# INSTALL
`npm install wast-transform`

# API
This has about same API as [generic-digraph](https://github.com/wanderer/generic-digraph/blob/master/docs/index.md). With a couple of additional functions

## parse(json)
Creates an AST from the JSON format. Properties of each node are stored in `value`.

## toJSON
Reproduces the AST in the JSON format

# LICENSE
[MPL-2.0](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2))
