#!/usr/bin/env node --harmony

// dependencies
var co = require('co');
var prompt = require('co-prompt');
var columnify = require('columnify');
var program = require('commander');
var colors = require('colors');

var utils = require('./lib/utils');
var entries = require('./lib/entries');
entries.loadFrom(utils.getConfigFilePath());

// version
program.version('0.0.6');

// command definitions
program
    .command('list [query]')
    .description('Lists all known locations')
    .action(function(query) {
        if (query) {
            console.log(('All known locations you could have searched for like "' + query + '":\n').bold);
        } else {
            console.log('All locations:\n'.bold);
        }

        var validEntries = entries.search(query);
        console.log(columnify(validEntries).bold);
    });

program
    .arguments('<name> [manipulator]')
    .description('Output the location known under this name or the cwd if the location is unknown')
    .action(function (name, manipulator) {
        if (entries.isKnown(name)) {
            var entry = entries.get(name);

            console.log(utils.manipulatePath(entry.path, manipulator));

            entry.usages++;
            entries.save();
        } else {
            console.log(process.cwd());
        }
    });

program
    .command('rm <name>')
    .description('Remove the known location under this name')
    .action(function(name) {
        if (!entries.isKnown(name)) {
            console.log(('No location is known under the name ' + name + '.').red);
        } else {
            var prevLocation = entries.get(name);
            entries.remove(name);
            console.log(('Location ' + name + ' which was pointing to ' + prevLocation.path + ' was successfully removed.').green);
        }
    });

program
    .command('forget')
    .description('Forget usage statistics of known locations')
    .action(function () {
        entries.resetUsages();
        console.log(('Successfully resetted all usage statistics (' + accesses + ' accesses in total)!').green);
    });

program
    .command('edit <name>')
    .description('Edit the location known under this name')
    .action(function (name) {
        co(function *() {

            if (entries.isKnown(name)) {
                var entry = entries.get(name);
                console.log(('The location "' + name + '" was found and leads to ' + entry.path + '. The current description is:\n' + entry.desc).green);

                var newDescription = yield prompt('\nNew description: ');
                entries.edit(name, newDescription);
            } else {
                console.log(('I don\'t remember a location named "' + name + '"...').yellow);
            }

            process.exit(0);
        });
    });

program
    .command('add <name>')
    .description('Add the currently visited location as known one under a name')
    .action(function(name) {
        co(function *() {
            if (entries.isKnown(name)) {
                var knownPath = entries.get(name).path;
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

            entries.add(name, newLocation);
            console.log(('Current path (' + newLocation.path + ')' + ' is now known under the name ' + name + '.\nDescription: ' + desc).green);
            process.exit(0);
        });
    });

// Main
program.parse(process.argv);
