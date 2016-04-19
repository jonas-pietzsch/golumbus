#!/usr/bin/env node --harmony

var jsonfile = require('jsonfile');
var config;
var configFile;

module.exports = {
    get: function () {
        return config;
    },

    load: function (file) {
        configFile = file;
        config = jsonfile.readFileSync(configFile);
        return config;
    },

    save: function () {
        jsonfile.writeFileSync(configFile, config, {spaces: 2});
    }
};
