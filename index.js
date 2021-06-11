const co = require('co')
const prompt = require('co-prompt')
const columnify = require('columnify')
const program = require('commander')
const chalk = require('chalk')

const utils = require('./src/utils')
const Entries = require('./src/entries')
const installer = require('./src/installer')

const entries = new Entries()
entries.loadFrom(utils.getConfigFilePath())
program.version(require('./package.json').version)

// command definitions
program
    .command('list [query]')
    .description('Lists all known locations')
    .action((query) => {
        if (query) {
            console.log(chalk.bold('All known locations you could have searched for like "' + query + '":\n'))
        }

        let validEntries = entries.search(query)
        if (validEntries.length > 0) {
            console.log(chalk.bold(columnify(validEntries)))
        } else {
            console.log(chalk.yellow('No locations were added yet'))
        }
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
            console.log(chalk.green('No location is known under the name ' + name + '.'))
        } else {
            const prevLocation = entries.get(name)
            entries.remove(name)
            console.log(chalk.green('Location ' + name + ' which was pointing to ' + prevLocation.path + ' was successfully removed.'))
        }
    })

program
    .command('forget')
    .description('Forget usage statistics of known locations')
    .action(() => {
        console.log(chalk.green('Successfully resetted all usage statistics (' + entries.resetUsages() + ' accesses in total).'))
    })

program
    .command('purge')
    .description('Delete all bookmarked locations where the directory is no more existing')
    .action(() => {
        const purgedCount = entries.purgeNotExisting()
        console.log(chalk.green('Successfully deleted ' + purgedCount + ' locations.'))
    })

program
    .command('install [shell]')
    .description('Detects your shell and installs the goto command for it')
    .action((shell) => {
        console.log(chalk.green(installer.installGoto(shell)))
    })

program
    .command('edit <name>')
    .description('Edit the location known under this name')
    .action((name) => {
        co(function* () {

            if (entries.isKnown(name)) {
                const entry = entries.get(name)
                console.log(chalk.green('The location "' + name + '" was found and leads to ' + entry.path + '. The current description is:\n' + entry.desc))

                const newDescription = yield prompt('\nNew description: ')
                entries.edit(name, newDescription)
            } else {
                console.log(chalk.yellow('I don\'t remember a location named "' + name + '"...'))
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
                console.log(chalk.yellow('Warning! The name ' + name + ' already knows the way to ' + knownPath))
                const overwrite = yield prompt('Overwrite? (y/n): ')

                if (overwrite == 'n') {
                    console.log(chalk.green('Okay, going to remember ' + knownPath + ' under the name ' + name + ', Sir!'))
                    process.exit(0)
                } else {
                    console.log(chalk.bold('Alright, let \'s forget what we remember as ' + name + '...'))
                }
            }

            const desc = yield prompt('Description: ')
            const newLocation = {
                path: process.cwd(),
                desc,
                usages: 0
            }

            entries.add(name, newLocation)
            console.log(chalk.green('Current path (' + newLocation.path + ')' + ' is now known under the name ' + name + '.\nDescription: ' + desc))
            process.exit(0)
        })
    })

program.parse(process.argv)
