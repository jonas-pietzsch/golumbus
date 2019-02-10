const co = require('co')
const prompt = require('co-prompt')
const columnify = require('columnify')
const program = require('commander')

const utils = require('./lib/utils')
const entries = require('./lib/entries')
const installer = require('./lib/installer')

entries.loadFrom(utils.getConfigFilePath())
program.version(require('./package.json').version)

// command definitions
program
    .command('list [query]')
    .description('Lists all known locations')
    .action((query) => {
        if (query) {
            console.log(('All known locations you could have searched for like "' + query + '":\n').bold)
        } else {
            console.log('All locations:\n'.bold)
        }

        let validEntries = entries.search(query)
        console.log(columnify(validEntries).bold)
    })

program
    .arguments('<name> [manipulator]')
    .description('Output the location known under this name or the cwd if the location is unknown')
    .action((name, manipulator) => {
        if (entries.isKnown(name)) {
            const entry = entries.get(name)
            console.log(utils.manipulatePath(entry.path, manipulator))
            entry.usages++
            entries.save()
        } else {
            console.log(process.cwd())
        }
    })

program
    .command('rm <name>')
    .description('Remove the known location under this name')
    .action((name) => {
        if (!entries.isKnown(name)) {
            console.log(('No location is known under the name ' + name + '.').red)
        } else {
            const prevLocation = entries.get(name)
            entries.remove(name)
            console.log(('Location ' + name + ' which was pointing to ' + prevLocation.path + ' was successfully removed.').green)
        }
    })

program
    .command('forget')
    .description('Forget usage statistics of known locations')
    .action(() => {
        console.log(('Successfully resetted all usage statistics (' + entries.resetUsages() + ' accesses in total).').green)
    })

program
    .command('purge')
    .description('Delete all bookmarked locations where the directory is no more existing')
    .action(() => {
        const purgedCount = entries.purgeNotExisting()
        console.log(('Successfully deleted ' + purgedCount + ' locations.').green)
    })

program
    .command('install [shell]')
    .description('Detects your shell and installs the goto command for it')
    .action((shell) => {
        console.log(installer.installGoto(shell).green)
    })

program
    .command('edit <name>')
    .description('Edit the location known under this name')
    .action((name) => {
        co(function* () {

            if (entries.isKnown(name)) {
                const entry = entries.get(name)
                console.log(('The location "' + name + '" was found and leads to ' + entry.path + '. The current description is:\n' + entry.desc).green)

                const newDescription = yield prompt('\nNew description: ')
                entries.edit(name, newDescription)
            } else {
                console.log(('I don\'t remember a location named "' + name + '"...').yellow)
            }

            process.exit(0)
        })
    })

program
    .command('add <name>')
    .description('Add the currently visited location as known one under a name')
    .action((name) => {
        co(function* () {
            if (entries.isKnown(name)) {
                const knownPath = entries.get(name).path
                console.log(('Warning! The name ' + name + ' already knows the way to ' + knownPath).yellow)
                const overwrite = yield prompt('Overwrite? (y/n): ')

                if (overwrite == 'n') {
                    console.log(('Okay, going to remember ' + knownPath + ' under the name ' + name + ', Sir!').green)
                    process.exit(0)
                } else {
                    console.log(('Alright, let \'s forget what we remember as ' + name + '...').rainbow)
                }
            }

            const desc = yield prompt('Description: ')
            const newLocation = {
                path: process.cwd(),
                desc,
                usages: 0
            }

            entries.add(name, newLocation)
            console.log(('Current path (' + newLocation.path + ')' + ' is now known under the name ' + name + '.\nDescription: ' + desc).green)
            process.exit(0)
        })
    })

program.parse(process.argv)
