should = require 'should'
clijs = require '../index'
fs = require 'fs'

describe 'search', ->

  it 'should return an array of packages for a valid query', (done) ->
    clijs.commands.search 'jquery', (res) ->
      res.should.be.an.array
      res.length.should.be.above 1
      done()

  it 'should return an empty array for an invalid query', (done) ->
    clijs.commands.search 'safdfss', (res) ->
      res.should.be.an.array
      res.length.should.be.below 1
      done()

describe 'list', ->

  it 'should return an array of all packages', (done) ->
    clijs.commands.list (res) ->
      res.should.be.an.array
      res.length.should.be.above 1
      done()

describe 'info', ->

  it 'should find a single result for a valid query', (done) ->
    clijs.commands.find 'jquery', (res) ->
      res.should.be.an.object
      res.name.should.equal 'jquery'
      done()

  it 'should return false for an invalid query', ->
    clijs.commands.find 'dasasd', (res) ->
      res.should.be.false

describe 'copy', ->

  it 'should return a url for a valid query', (done) ->
    clijs.commands.get_url 'jquery', (res) ->
      res.should.be.a.string
      res.length.should.be.above 10
      done()

  it 'should return false for an invalid query', (done) ->
    clijs.commands.get_url 'asdsad', (res) ->
      res.should.be.false
      done()

describe 'update', ->

  it 'should update the cached package file', (done) ->

    mtime_before = fs.statSync(clijs.config.cache_path).mtime

    clijs.cache.refresh ->
      mtime_after = fs.statSync(clijs.config.cache_path).mtime
      mtime_before.should.be.below mtime_after
      done()