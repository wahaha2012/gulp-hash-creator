var gulp = require("gulp");
var hashCreator = require("../bin/hash.js");

var template = 'var hashList = {\n\
        {{{hashList}}}\n\
    };'

gulp.task("hashString", function(){
    var v = hashCreator({
        content:1,
        length: 16
    });
    console.log(v);
});

gulp.task("hashFiles", function(){
    return gulp.src("./*.*")
            .pipe(hashCreator({
                forceUpdate: true,
                length:6,
                hashName: 'md5',
                delimiter: ",\n\t\t",
                output: 'hashList.js',
                outputTemplate: template,
                format: function (obj) {
                    return '"' + obj.path + '": "' + obj.path +"?v"+ obj.hash + '"';
                }
            }));
});

gulp.task("hashStringNoLog", function(){
    var v = hashCreator({
        content:1,
        length: 16,
        log: false
    });
    // console.log(v);
});

gulp.task("hashFilesNoLog", function(){
    return gulp.src("./*.*")
            .pipe(hashCreator({
                forceUpdate: true,
                length:6,
                log: false,
                hashName: 'md5',
                delimiter: ",\n\t\t",
                output: 'hashList.js',
                outputTemplate: template,
                format: function (obj) {
                    return '"' + obj.path + '": "' + obj.path +"?v"+ obj.hash + '"';
                }
            }));
});

gulp.task("instanceHashString",["instanceHashFiles"], function(){
    var v = new hashCreator({
        content:1,
        length: 16
    });
    console.log(v.hashData.hash);
});

gulp.task("instanceHashFiles", function(){
    return gulp.src("./*.*")
            .pipe(new hashCreator({
                forceUpdate: true,
                length:6,
                hashName: 'md5',
                delimiter: ",\n\t\t",
                output: 'hashList.js',
                outputTemplate: template,
                format: function (obj) {
                    return '"' + obj.path + '": "' + obj.path +"?v"+ obj.hash + '"';
                }
            }));
});

gulp.task("default", ["hashString", "hashFiles"]);
gulp.task("nolog", ["hashStringNoLog", "hashFilesNoLog"]);
gulp.task("instance", ["instanceHashString"]);