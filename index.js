#!/usr/bin/env node --harmony

// Dependencies
require('shelljs/global');
var co = require('co');
var prompt = require('co-prompt');
var columnify = require('columnify');
var program = require('commander');
var chalk = require('chalk');
var colors = require('colors');
var jsonfile = require('jsonfile');

var appDir = require('path').dirname(require.main.filename);
var configFile =  appDir + '/golumbus.json';
var configFormat = {spaces: 2};
var config = jsonfile.readFileSync(configFile);

program.version('0.0.5');

program
    .command('list [query]')
    .description('Lists all known locations')
    .action(function(query) {
        console.log(('All known locations' + (query ? ' containing "' + query + '"' : '') + ':\n').blue.bold);
        var entries = [];

        for (var name in config.entries) {
            var rawEntry = config.entries[name];
            if ( !query || (name.indexOf(query) > -1 || rawEntry.desc.indexOf(query) > -1) ) {
                entries.push({
                    name: name,
                    description: rawEntry.desc,
                    path: rawEntry.path,
                    usages: rawEntry.usages
                });
            }
        }

        entries.sort(function(a, b){
            return b.usages - a.usages
        });
        console.log(columnify(entries).bold);
    });



program
    .arguments('<name>')
    .description('Sail to the location known under this name without your sextant')
    .action(function (name) {
        console.log(config.entries[name].path.rainbow);
        config.entries[name].usages++;
        jsonfile.writeFileSync(configFile, config, configFormat);
    });

program
    .command('rm <name>')
    .description('Remove the known location under this name')
    .action(function(name) {
        if (config.entries[name] == undefined) {
            console.log(('No location is known under the name ' + name + '.').red);
        } else {
            var prevLocation = config.entries[name];
            delete config.entries[name];
            jsonfile.writeFileSync(configFile, config, configFormat);
            console.log(('Location ' + name + ' which was pointing to ' + prevLocation.path + ' was successfully removed.').green);
        }
    });

program
    .command('forget')
    .description('Forget usage statistics of known locations')
    .action(function () {
        var accesses = 0;

        for (var name in config.entries) {
            accesses += config.entries[name].usages;
            config.entries[name].usages = 0;
        }

        jsonfile.writeFileSync(configFile, config, configFormat);
        console.log(('Successfully resetted all usage statistics (' + accesses + ' accesses in total)!').green);
    });

program
    .command('add <name>')
    .description('Add the currently visited location as known one under a name')
    .action(function(name) {
        co(function *() {
            if (config.entries[name] != undefined) {
                var knownPath = config.entries[name].path;
                console.log(('Warning! The name ' + name + ' already knows the way to ' + knownPath).yellow);
                var overwrite = yield prompt('Overwrite? (y/n): ');
                if (overwrite == 'n') {
                    console.log(('Okay, going to remember ' + knownPath + ' under the name ' + name + ', Sir!').green);
                    process.exit(0);
                } else {
                    console.log(('Alright, let \'s forget what we remember as ' + name + '...').rainbow);
                }
            }

            var desc = yield prompt('Description: ');
            var newLocation = {
                path: process.cwd(),
                desc: desc,
                usages: 0
            };

            config.entries[name] = newLocation;
            jsonfile.writeFileSync(configFile, config, configFormat);
            console.log(('Current path (' + newLocation.path + ')' + ' is now known under the name ' + name + '.\nDescription: ' + desc).green);
            process.exit(0);
        });
    });

// Main
program.parse(process.argv);
