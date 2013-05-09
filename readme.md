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

coming soon...