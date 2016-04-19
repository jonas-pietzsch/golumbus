#!/usr/bin/env node --harmony

module.exports = {
    sorter: function(a, b) {
        return b.usages - a.usages;
    },

    stringContains: function (input, query) {
        return input.indexOf(query) > -1;
    },

    getTransformedEntry: function (name, entry) {
        return {
            name: name,
            desc: entry.desc,
            path: entry.path,
            usages: entry.usages
        };
    },

    getAsIndexed: function (entries) {
        var result = [];

        for (var name in entries) {
            result.push(this.getTransformedEntry(name, entries[name]));
        }

        return result;
    },

    getConfigFilePath: function () {
        return require('path').dirname(require.main.filename) + '/golumbus.json';
    }
};
