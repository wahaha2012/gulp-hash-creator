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


gulp.task("default", ["hashString", "hashFiles"]);