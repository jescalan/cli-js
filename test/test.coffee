should = require 'should'
cdnjs = require '../index'

describe 'search', ->

  it 'should return an array of packages for a valid query', (done) ->
    cdnjs.commands.search 'jquery', (res) ->
      res.should.be.an.array
      res.length.should.be.above 1
      done()

  it 'should return an empty array for an invalid query', (done) ->
    cdnjs.commands.search 'safdfss', (res) ->
      res.should.be.an.array
      res.length.should.be.below 1
      done()

describe 'list', ->

  it 'should return an array of all packages', (done) ->
    cdnjs.commands.list (res) ->
      res.should.be.an.array
      res.length.should.be.above 1
      done()

describe 'info', ->

  it 'should find a single result for a valid query', (done) ->
    cdnjs.commands.find 'jquery', (res) ->
      res.should.be.an.object
      res.name.should.equal 'jquery'
      done()

  it 'should return false for an invalid query', ->
    cdnjs.commands.find 'dasasd', (res) ->
      res.should.be.false
