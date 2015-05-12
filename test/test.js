'use strict';

var fs = require('fs');
var path = require('path');
var ipaddrParser = require('../index.js');

var dumpsDir = path.join(__dirname, 'dumps');

fs.readdir(dumpsDir, function (err, files) {
    if (err) {
        throw err;
    }

    files.forEach(function (file) {
        fs.readFile(path.join(dumpsDir, file), {encoding: 'utf8'}, function (err, data) {
            if (err) {
                throw err;
            }

            try {
                console.log(file);
                console.log(ipaddrParser(data));
            } catch (err) {
                throw err;
            }
        });
    });
});
