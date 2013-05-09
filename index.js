var http = require('http'),
    fs = require('fs'),
    _ = require('lodash'),
    colors = require('colors'),
    fuzzy = require('fuzzy');

var url = 'http://cdnjs.com/packages.json';
var cache_path = '/tmp/cdnjs-cache.json';
var days_to_cache_expire = 2

switch (process.argv[2]) {
  case 'search':
    read_packages(function(packages){ search(packages, process.argv[3]) });
    break;
  default:
    help();
}

function search(packages, query){
  var names = packages.map(function(a){ return a.name });
  var results = fuzzy.filter(query, names).map(function(a){ return a.string });
  header('search results')
  results.forEach(function(result){ console.log(result); });
  console.log('');
}

function read_packages(cb){
  check_cache_expire(function(){
    cb(JSON.parse(fs.readFileSync(cache_path)).packages);
  });
}

function check_cache_expire(cb){
  var last_cached = fs.statSync(cache_path).mtime;
  var now = new Date;
  if (now.setDate(now.getDate() - days_to_cache_expire) > last_cached) {
    console.log('updating cache');
    cache_packages(cb);
  } else {
    cb();
  }
}

function cache_packages(cb){
  var file = fs.createWriteStream(cache_path);
  http.get(url, function(data){ data.pipe(file); cb() });
}

function help(){
  header('cli-js usage');
  console.log('search [name]: '.bold + 'fuzzy search the package repository');
  console.log('');
}

function header(text){
  var line = '';
  for (var i = 0; i < text.length; i++){ line += '-' };
  console.log('');
  console.log(line.green);
  console.log(text.green);
  console.log(line.green);
  console.log('');
}