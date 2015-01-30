gulp-hash-creator
=========

get content hash value with md5 or sha1.

# install #

```bash
$ npm install gulp-hash-creator --save-dev
```

# Usage #

For gulp
```javascript
//include gulp
var gulp = require("gulp");
//include gulp-hash-creator
var hashCreator = require("gulp-hash-creator");

//hash string content
gulp.task("hashString", function(){
    var value = hashCreator({
        content:"test content"
    });

    console.log(value);
});

//hash file
gulp.task("hashFiles", function(){
    return gulp.src("./*.*")
            .pipe(hashCreator());
});
```

For normal javascript
```javascript
//include gulp-hash-creator
var hashCreator = require("gulp-hash-creator");

//hash string content
function hashString(stringContent){
    return hashCreator({
        content: stringContent
    });
}

console.log(hashString("test content"));
```

# API #
```javascript
//main function
hashCreator(config);

//hash config
config : {
    forceUpdate: true,
    length:6,
    hashName: 'md5',
    output: 'hash-list.js',
    outputTemplate: "Hash List is:\n {{{hashList}}}",
    delimiter: "",
    format: function (obj) {
        return '"' + obj.path + '": "' + obj.path +"?v"+ obj.hash + '"';
    }
}

//All config is optional
> forceUpdate    
{Boolean}(default:false) force overwrite output file

> length         
{Integer} hash value length

> hashName       
{String}(default:'md5') ['md5'/'sha1'] hash algorithms name

> output         
{String}(default:'md5-hash-list') file name which use to output hash values

> outputTempate  
{String} string template for join hash values, the placeholder is {{{hashList}}}

> delimiter
{String} add delimiter to separate each hash values

> format         
{Function}(default:'file hash') format original hash array values to string
```