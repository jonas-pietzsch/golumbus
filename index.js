const co = require('co')
const prompt = require('co-prompt')
const columnify = require('columnify')
const program = require('commander')
const chalk = require('chalk')

const { manipulatePath } = require('./src/utils')
const { Entries } = require('./src/entries')
const installer = require('./src/installer')

const entries = new Entries()
program.version(require('./package.json').version)

// command definitions
program
    .command('list [query]')
    .description(
        "Lists all known locations. Searches them when providing 'query'",
    )
    .action(query => {
        if (query) {
            console.log(
                chalk.bold(`Results for saved locations like '${query}':\n`),
            )
        }

        const matches = entries.search(query)
        if (matches.length) {
            console.log(chalk.bold(columnify(matches)))
        } else {
            console.log(chalk.yellow('You have not saved any locations yet'))
        }
    })

program
    .arguments('<name> [manipulator]')
    .description(
        'Output the location known under this name. If location not known, current working directory is returned.',
    )
    .action((name, manipulator) => {
        if (entries.isKnown(name)) {
            const entry = entries.get(name)
            console.log(manipulatePath(entry.path, manipulator))
            entry.usages++
            entries.save()
        } else {
            console.log(process.cwd())
        }
    })

program
    .command('rm <name>')
    .description('Remove the location known under this name, if existing')
    .action(name => {
        if (!entries.isKnown(name)) {
            console.log(
                chalk.green(`No location is known under the name '${name}'.`),
            )
        } else {
            const prevLocation = entries.get(name)
            entries.delete(name)
            console.log(
                chalk.green(
                    `Location named '${name}' (${prevLocation.path}) has been removed.`,
                ),
            )
        }
    })

program
    .command('forget')
    .description('Forget usage statistics of all locations')
    .action(() => {
        console.log(
            chalk.green(
                `Successfully reset all usage statistics (${entries.resetUsages()} visits in total).`,
            ),
        )
    })

program
    .command('purge')
    .description(
        'Purges all bookmarks which do not have existing directories in the file system anymore',
    )
    .action(() => {
        const deletedCount = entries.deleteNonExistingPaths()
        console.log(
            chalk.green(`Successfully purged ${deletedCount} locations.`),
        )
    })

program
    .command('install [shell]')
    .description(
        "Detects your shell and installs the goto command for it. If 'shell' parameter provided, installs command for this shell.",
    )
    .action(shell => {
        console.log(chalk.green(installer.installGoto(shell)))
    })

program
    .command('edit <name>')
    .description('Edit the location known under this name')
    .action(name => {
        co(function* () {
            if (entries.isKnown(name)) {
                const entry = entries.get(name)
                console.log(
                    chalk.green(
                        `The location '${name}' was found and leads to ${entry.path}. The current description is:\n${entry.desc}`,
                    ),
                )

                const newDescription = yield prompt('\nNew description: ')
                entries.edit(name, newDescription)
            } else {
                console.log(
                    chalk.yellow(
                        `I don't know about a location named '${name}'...`,
                    ),
                )
            }

            process.exit(0)
        })
    })

program
    .command('add <name>')
    .description('Add the currently visited location as known one under a name')
    .action(name => {
        co(function* () {
            if (entries.isKnown(name)) {
                const knownPath = entries.get(name).path
                console.log(
                    chalk.yellow(
                        `Warning! The name '${name}' already knows the way to ${knownPath}`,
                    ),
                )
                const overwrite = yield prompt('Overwrite? (y/n): ')

                if (overwrite == 'n') {
                    console.log(
                        chalk.green(
                            `Okay, going to remember ${knownPath} under the name '${name}'`,
                        ),
                    )
                    process.exit(0)
                } else {
                    console.log(
                        chalk.bold(
                            `Alright, let 's forget what we remember as '${name}'`,
                        ),
                    )
                }
            }

            const desc = yield prompt('Description: ')
            const newLocation = {
                path: process.cwd(),
                desc,
                usages: 0,
            }

            entries.add(name, newLocation)
            console.log(
                chalk.green(
                    `Current path (${newLocation.path}) is now known under the name '${name}'.\nDescription: ${desc}`,
                ),
            )
            process.exit(0)
        })
    })

program.parse(process.argv)
