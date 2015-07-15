/**
 * author: wxwdesign@gmail.com
 * github: https://github.com/wahaha2012/gulp-hash-creator
 */
var through = require("through");
var _ = require("lodash");

var path = require("path");
var utils = require("./utils");

var cliColors = require('./cli-color');

var defaultConfig = {
        hashName: 'md5',
        dest: process.cwd(),
        log: true,
        delimiter: "",
        format: function (obj) {
            return obj.path + " " + obj.hash + "\n";
        }
    };

function hashCreator(options){
    var self = this;
    this.config = _.extend({}, defaultConfig, options);
    this._data = {};

    this.config.output = this.config.output || this.config.hashName + "-hash-list";
    this._data.hashesFilePath = path.resolve(this.config.dest, this.config.output);
    this._data.hashes = [];

    // this.config.log && console.log("*** gulp hash start ***");
    this.config.log && console.log("*** algorithms: "+cliColors.notice(this.config.hashName)+", length: "+cliColors.notice(this.config.length)+", output: "+cliColors.notice(this.config.output)+" ***");

    if(utils.typeOf(this.config.content)!=='undefined'){
        this.config.log && console.log(cliColors.warn("hash string content"));
        this.hashData = {path:this.config.content, hash:utils.calcHash(this.config)};
        return this.hashData.hash;
    }else{
        this.config.log && console.log(cliColors.warn("hash files stream"));
        return through(function(file){utils.readFile(file, this, self)}, function(){utils.writeHashList(this, self)});
    }
}

module.exports = hashCreator;