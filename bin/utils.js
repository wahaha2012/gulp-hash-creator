/**
 * author: wxwdesign@gmail.com
 * github: https://github.com/wahaha2012/gulp-hash-creator
 */
var crypto = require('crypto');
var _ = require("lodash");

var fs = require("fs");
var path = require("path");
var slash = require('slash');
var mkdirp = require("mkdirp");

var cliColors = require('./cli-color');

var utils = {
    readFile: function(file, self, creator){
        if (file.isNull()) {
            return;
        }
        if (file.isStream()) {
            console.log(cliColors.error("streams not supported"));
            return;
        }

        var filePath = path.resolve(creator.config.dest, file.path),
            hashKey = slash(path.relative(path.dirname(creator._data.hashesFilePath), filePath)),
            hashValue = utils.calcHash(_.extend({file:file}, creator.config));

        creator._data.hashes.push({path:hashKey, hash:hashValue});

        creator.config.log && console.log(hashKey + " ==> " + cliColors.warn(hashValue));

        self.push(file);
    },

    writeHashList: function(self, creator){
        var lines = _.map(creator._data.hashes, creator.config.format),
            bufferString = lines.join(creator.config.delimiter),
            hashesFilePath = creator._data.hashesFilePath;

        if(creator.config.outputTemplate){
            bufferString = creator.config.outputTemplate.replace("{{{hashList}}}", bufferString);
        }

        var data = new Buffer(bufferString);

        if (creator.config.forceUpdate || !fs.existsSync(hashesFilePath)) {
            mkdirp(path.dirname(hashesFilePath));
            fs.writeFileSync(hashesFilePath, data);

            creator.config.log && console.log(hashesFilePath + " updated!");
        }else{
            console.log(cliColors.error(hashesFilePath + " exists, please set forceUpdate option true to force overwrite it."));
        }
        self.emit("end");
    },

    /**
     * [calcHash description]
     * @param  {[Object]} options [{file:fileStreamObject, hashName:'md5', slice:, content:}]
     * @return {[String]}         [hash value]
     */
    calcHash: function(options){
        options = options || {};

        var contents = utils.typeOf(options.file, "object") ? options.file.contents : String(options.content),
            contentsType = utils.typeOf(options.file, "object") ? "binary" : "utf8";

        var hash = crypto
                .createHash(options.hashName)
                .update(contents, contentsType)
                .digest("hex");

        return options.length >0 ? hash.slice(0, options.length) : hash;
    },

    typeOf: function(obj, type) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
        return type?obj !== undefined && obj !== null && clas === type:clas;
    }
};

module.exports = utils;