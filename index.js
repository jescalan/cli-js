#!/usr/bin/env node

var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    colors = require('colors'),
    async = require('async'),
    copy_paste = require('copy-paste');

exports.commands = require('./lib/commands');
exports.print = require('./lib/print_utils');
exports.cache = require('./lib/cache');

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