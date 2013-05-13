var fs = require('fs'),
    http = require('http'),
    config = require('./config');

function read_packages(cb){
  check_cache_expire(function(){
    cb(JSON.parse(fs.readFileSync(config.cache_path, 'utf8')).packages);
  });
}

function check_cache_expire(cb){
  var last_cached = fs.statSync(config.cache_path).mtime;
  var now = new Date;
  if (now.setDate(now.getDate() - config.days_to_cache_expire) > last_cached) {
    cache_packages(cb);
  } else {
    cb();
  }
}

function cache_packages(cb){
  var file = fs.createWriteStream(config.cache_path);
  var stream = null;
  http.get(config.url, function(data){
    data.pipe(file);
    data.on('end', cb);
    data.on('error', function(err){ cb(err) });
  });
}

module.exports = {
  read: read_packages,
  refresh: cache_packages
}