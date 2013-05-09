cli-js
------

Tiny, fast command line interface to [cdnjs](http://cdnjs.com/) with fuzzy package search and a public api for easy integration into other node apps.

### Installation

`$ [sudo] npm install cli-js -g`

### Usage

`roots js list` - lists all packages    
`roots js search [name]` - search packages for a keyword    
`roots js info [name]` - more information on a specific package    
`roots js copy [name]` - copies the cdnjs link to your clipboard    
`roots js update` - updates the cache    
`roots js install [name]` - downloads the specified package to a folder called `components`

   - if it's a single javascript file, only downloads the minified version
   - if you want all versions, use `--all` at the end
   - if there are multiple scripts and/or css files, puts them in a folder called `[name]`

### Public API

I've made sure to keep a very clean separation in place between the utilities that process data and those that print results. Because of this, it's easy for other node app authors to integrate cli-js into whatever app it may be needed in and customize the output how they like. The public api gives direct access to the functions below:

```js
var cli_js = require('cli-js');

// set up config variables (defaults shown below)
cli_js.url = 'http://cdnjs.com/packages.json';
cli_js.cache_path = '/tmp/cdnjs-cache.json';
cli_js.days_to_cache_expire = 2;

// read all packages from cdnjs, returns array of objects
cli_js.read_packages(function(pkg){ console.log(pkg); });

// update cache regardless of cache expire
cli_js.cache_packages(function(){ console.log('done'); });

// fuzzy search, returns array of results
cli_js.search('jquery', function(results){ console.log(results); });

// find one specific package by name, returns an object
cli_js.find('jquery', function(result){ console.log(result); });

// get the cdn hosted url for a specific package
cli_js.get_url('jquery', function(url){ console.log(url); });
```

It should be noted that the cacheing is handled internally, so no need to ever worry about it. If you do want to update the cache on demand, you can use the `cache_packages` function.