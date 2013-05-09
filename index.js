var http = require('http'),
    fs = require('fs'),
    _ = require('lodash'),
    colors = require('colors'),
    fuzzy = require('fuzzy');

var url = exports.url = 'http://cdnjs.com/packages.json';
var cache_path = exports.cache_path = '/tmp/cdnjs-cache.json';
var days_to_cache_expire = exports.days_to_cache_expire = 2;

switch (process.argv[2]) {
  case 'search':
    read_packages(function(pkg){
      var results = search(pkg, process.argv[3])
      header('search results');
      if (results.length > 0){
        print_array(results);
      } else {
        console.log('no results found'.red);
      }
      console.log('');
    });
    break;
  case 'list':
    read_packages(function(pkg){
      header('all packages');
      print_array(pkg.map(function(a){ return a.name }));
      console.log('');
    });
    break;
  case 'info':
    read_packages(function(pkg){
      var result = info(pkg, process.argv[3]);
      if (result) {
        print_info(result);  
      } else {
        console.log('');
        console.log('no results found'.red);
        console.log('maybe try a ' + 'search'.bold + '?')
        console.log('');
      }
      
    });
    break;
  default:
    help();
}

// 
// search
// 

function search(packages, query){
  var names = packages.map(function(a){ return a.name });
  return fuzzy.filter(query, names).map(function(a){ return a.string });
}

exports.search = search;

// 
// info
// 

function info(packages, query){
  var result = _.where(packages, { name: query })
  if (result[0]){ return result[0] } else { return false; }
}

// 
// help
// 

function help(){
  header('cli-js usage');
  console.log('search [name]: '.bold + 'fuzzy search the package repository');
  console.log('');
}

// 
// read and cache
// 

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

// 
// print utilities
// 

function header(text){
  var line = '';
  for (var i = 0; i < text.length; i++){ line += '-' };
  console.log('');
  console.log(line.green);
  console.log(text.green);
  console.log(line.green);
  console.log('');
}

function print_array(ary){
  ary.forEach(function(a){ console.log(a) });
}

function print_info(obj){
  header(obj.name);
  console.log(obj.description);
  console.log('');
  console.log('Current Version: '.bold + obj.version);
  console.log('Docs: '.bold + obj.homepage);

  if (obj.maintainers){
    console.log('Maintainers: '.bold)
    obj.maintainers.forEach(function(m){
      console.log('  - ' + m.name);
    });
  }

  console.log('')

}