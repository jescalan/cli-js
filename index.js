#!/usr/bin/env node

var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    colors = require('colors'),
    async = require('async'),
    copy_paste = require('copy-paste'),
    fuzzy = require('fuzzy');

var url = exports.url = 'http://cdnjs.com/packages.json';
var cache_path = exports.cache_path = '/tmp/cdnjs-cache.json';
var days_to_cache_expire = exports.days_to_cache_expire = 2;
var download_path = exports.download_path = process.cwd();

switch (process.argv[2]) {
  case 'search':
    search(process.argv[3], function(results){
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
    find(process.argv[3], function(result){
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
  case 'copy':
    get_url(process.argv[3], function(result){
      copy(result);
      console.log(result.green);
    });
    break;
  case 'update':
    cache_packages(function(){
      console.log('');
      console.log('updated'.green);
      console.log('');
    });
    break;
  case 'download':
    var cb = function(results){
      console.log('');
      console.log(results.name.green + ' installed'.green);
      console.log('');
    }

    if (process.argv[4]){
      download(process.argv[3], process.argv[4], cb);
    } else {
      download(process.argv[3], cb);
    }
    break;
  default:
    help();
}

//
// search
//

function search(query, cb){
  read_packages(function(pkg){
    var names = pkg.map(function(a){ return a.name });
    cb(fuzzy.filter(query, names).map(function(a){ return a.string }));
  });
}

exports.search = search;

//
// find
//

function find(query, cb){
  read_packages(function(pkg){
    var result = _.where(pkg, { name: query })
    if (result[0]){ cb(result[0]) } else { cb(false) }
  });
}

exports.find = find;

//
// get_url
//

function get_url(query, cb){
  read_packages(function(pkg){
    find(query, function(result){
      cb(format_url(result));
    });
  });
}

function format_url(obj, file){
  var base = '//cdnjs.cloudflare.com/ajax/libs/';
  var file = file ? file : obj.filename;
  return base + obj.name + '/' + obj.version + '/' + file;
}

exports.get_url = get_url;

//
// download
//

function download(query, base_path, cb){
  if (typeof base_path == 'function'){
    cb = base_path;
    base_path = download_path;
  } else {
    fs.existsSync(base_path) || fs.mkdirSync(base_path);
  }

  read_packages(function(pkg){
    find(query, function(result){
      var dir = path.join(base_path, result.name);
      fs.existsSync(dir) || fs.mkdirSync(dir);
      async.map(result.assets[0].files, download_file, function(){ cb(result); });

      function download_file(f, callback){
        var file = fs.createWriteStream(path.join(dir, f));
        http.get(format_url(result, f), function(data){ data.pipe(file); callback() });
      }
    });
  });

}

//
// help
//

function help(){
  header('cli-js usage');
  console.log('search [name]: '.bold + 'fuzzy search the package repository');
  console.log('list: '.bold + 'lists all packages');
  console.log('search [name]: '.bold + 'search packages for a keyword');
  console.log('info [name]: '.bold + 'more information on a specific package');
  console.log('copy [name]: '.bold + 'copies the cdnjs link to your clipboard');
  console.log('update: '.bold + 'updates the cache');
  console.log('install [name] [path]: '.bold + 'downloads the specified package to an optional path');
  console.log('');
}

//
// read and cache
//

function read_packages(cb){
  check_cache_expire(function(){
    cb(JSON.parse(fs.readFileSync(cache_path, 'utf8')).packages);
  });
}

exports.read_packages = read_packages;

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

exports.cache_packages = cache_packages;

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