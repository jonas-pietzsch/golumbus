#!/usr/bin/env node --harmony

var config = require('./config');
var utils = require('./utils');
var entries;

module.exports = {
    loadFrom: function (file) {
        entries = config.load(file).entries;
        return entries;
    },

    all: function () {
        return entries;
    },

    allContaining: function (query) {
        var result = [];

        for (var name in this.all()) {
            var entry = this.get(name);

            if ( !query || (utils.stringContains(name, query) || utils.stringContains(entry.desc, query)) ) {
                result.push(utils.getTransformedEntry(name, entry));
            }
        }

        result.sort(utils.sorter);
        return result;
    },

    add: function (name, entry) {
        entries[name] = entry;
        this.save();
    },

    resetUsages: function () {
        var totalAccesses = 0;

        for (var name in entries) {
            var entry = entries[name];
            totalAccesses += entry.usages;
            entry.usages = 0;
        }

        this.save();
        return totalAccesses;
    },

    edit: function (name, newDescription) {
        this.get(name).desc = newDescription;
        this.save();
    },

    remove: function (name) {
        delete entries[name];
        this.save();
    },

    get: function (name) {
        return this.all()[name];
    },

    isKnown: function (name) {
        return this.get(name) != undefined;
    },

    save: function () {
        config.save();
    }
};
