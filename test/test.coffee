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