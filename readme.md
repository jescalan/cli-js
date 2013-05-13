cli-js
------

Small, fast, and well-tested command line interface to [cdnjs](http://cdnjs.com/) with fuzzy package search and a public api for easy integration into other node apps.

### Installation

`$ [sudo] npm install cli-js -g`

### Usage

`cdnjs list` - lists all packages    
`cdnjs search [name]` - search packages for a keyword    
`cdnjs info [name]` - more information on a specific package    
`cdnjs copy [name]` - copies the cdnjs link to your clipboard    
`cdnjs update` - updates the cache    
`cdnjs install [name] [path]` - downloads the specified package to an optional path

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

// download the specified package to the specified path
cli_js.download('jquery', './components', function(result){ console.log('done'); })

// or skip the second parameter and it will default to the download path
cli_js.download('jquery', function(err){ console.log('done'); })
```

It should be noted that the cacheing is handled internally, so no need to ever worry about it. If you do want to update the cache on demand, you can use the `cache_packages` function.

### License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
