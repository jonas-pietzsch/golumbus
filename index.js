#!/usr/bin/env node --harmony

// Dependencies
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');
var chalk = require('chalk');
var colors = require('colors');
var jsonfile = require('jsonfile');

var configFile = './golumbus.json';
var configFormat = {spaces: 2};
var config = jsonfile.readFileSync(configFile);

program.version('0.0.2');

program
    .command('list')
    .description('Lists all known locations')
    .action(function() {
        var entries = config.entries;
        for (var name in entries) {
            var entry = entries[name];
            console.log('===> %s: %s (located at %s)"', name, entry.desc, entry.path);
        }
    });

program
    .arguments('<name>')
    .description('Sail to the location known under this name without your sextant')
    .action(function (name) {
        console.log(config.entries[name].path);
        process.chdir(config.entries[name].path);
    });

program
    .command('rm <name>')
    .description('Remove the known location under this name')
    .action(function(name) {
        if (config.entries[name] == undefined) {
            console.log('No location is known under the name ' + name + '.');
        } else {
            var prevLocation = config.entries[name];
            delete config.entries[name];
            jsonfile.writeFileSync(configFile, config, configFormat);
            console.log('Location ' + name + ' which was pointing to ' + prevLocation.path + ' was successfully removed.');
        }
    });

program
    .command('add <name>')
    .description('Add the currently visited location as known one under a name')
    .action(function(name) {
        co(function *() {
            if (config.entries[name] != undefined) {
                var knownPath = config.entries[name].path;
                console.log('Warning! The name ' + name + ' already knows the way to ' + knownPath);
                var overwrite = yield prompt('Overwrite? (y/n): ');
                if (overwrite == 'n') {
                    console.log('Okay, going to remember ' + knownPath + ' under the name ' + name + ', Sir!');
                    process.exit(0);
                } else {
                    console.log('Alright, let \'s forget what we remember as ' + name + '...');
                }
            }

            var desc = yield prompt('Description: ');
            var newLocation = {
                path: process.cwd(),
                desc: desc
            };

            config.entries[name] = newLocation;
            jsonfile.writeFileSync(configFile, config, configFormat);
            console.log('Current path (' + newLocation.path + ')' + ' is now known under the name ' + name + '.\nDescription: ' + desc);
            process.exit(0);
        });
    });

// Main
program.parse(process.argv);
