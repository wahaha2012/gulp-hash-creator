/**
 * Author: wxwdesign@gmail.com
 *
 * Usage:
 * var hashCreator = require("gulp-hash-creator");
 * var hash = hashCreator({
        content:"test content",
        length: 16
    });
    console.log(hash);

    gulp.src("js/*.js")
        .pipe(hashCreator({
            forceUpdate: true,
            length:16,
            hashName: 'sha1',
            output: 'version.js',
            //outputTemplate: "",
            format: function (obj) {
                return '"' + obj.path + '": "' + obj.path +"?v"+ obj.hash + '",\n';
            }
        }));
 */

var crypto = require('crypto');
var through = require("through");
var _ = require("lodash");

var fs = require("fs");
var path = require("path");
var slash = require('slash');
var mkdirp = require("mkdirp");

var clc = require('cli-color');
//define message colors
var error = clc.red.bold,
    notice = clc.cyan;
    warn = clc.yellow;

var config = {
        hashName: 'md5',
        dest: process.cwd(),
        delimiter: " ",
        format: function (obj) {
            return obj.path + config.delimiter + obj.hash + "\n";
        }
    },
    hashes = [],
    hashesFilePath;

function readFile(file){
    if (file.isNull()) {
        return;
    }
    if (file.isStream()) {
        console.log(error("streams not supported"));
        return;
    }

    var filePath = path.resolve(config.dest, file.path),
        hashKey = slash(path.relative(path.dirname(hashesFilePath), filePath)),
        hashValue = calcHash(_.extend({file:file}, config));

    hashes.push({path:hashKey, hash:hashValue});

    console.log(hashKey + " ==> " + warn(hashValue));

    this.push(file);
}

function writeHashList(){
    var lines = _.map(hashes, config.format),
        bufferString = lines.join("\t\t\t");

    if(config.outputTemplate){
        bufferString = config.outputTemplate.replace("{{{hashList}}}", bufferString);
    }

    var data = new Buffer(bufferString);

    if (config.forceUpdate || !fs.existsSync(hashesFilePath)) {
        mkdirp(path.dirname(hashesFilePath));
        fs.writeFileSync(hashesFilePath, data);

        console.log(hashesFilePath + " updated!");
    }else{
        console.log(error(hashesFilePath + " exists, please set forceUpdate option true to force overwrite it."));
    }
    this.emit("end");
}

/**
 * [calcHash description]
 * @param  {[Object]} options [{file:fileStreamObject, hashName:'md5', slice:, content:}]
 * @return {[String]}         [hash value]
 */
function calcHash(options){
    options = options || {};

    var contents = typeOf(options.file, "object") ? options.file.contents : String(options.content),
        contentsType = typeOf(options.file, "object") ? "binary" : "utf8";

    var hash = crypto
            .createHash(options.hashName)
            .update(contents, contentsType)
            .digest("hex");

    return options.length >0 ? hash.slice(0, options.length) : hash;
}

function typeOf(obj,type) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    return type?obj !== undefined && obj !== null && clas === type:clas;
}

module.exports = function(options){
    config = _.extend({}, config, options);

    config.output = config.output || config.hashName.toUpperCase() + "SUMS";
    hashesFilePath = path.resolve(config.dest, config.output);

    console.log("*** gulp hash start ***");
    console.log("*** hash type: "+notice(config.hashName)+" ***");
    config.length && console.log("*** hash length: "+notice(config.length)+" ***");

    if(typeOf(config.content)!=='undefined'){
        console.log(notice("hash content input"));
        return calcHash(config);
    }else{
        console.log(notice("hash file stream"));
        return through(readFile, writeHashList);
    }
};