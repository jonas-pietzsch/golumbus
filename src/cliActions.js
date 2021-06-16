const chalk = require('chalk')
const columnify = require('columnify')
const co = require('co')
const prompt = require('co-prompt')

const { installGoto } = require('./installer')
const { Entries } = require('./entries')
const { manipulatePath } = require('./utils')

const entries = new Entries()

const install = shell => {
    console.log(chalk.green(installGoto(shell)))
}

const getPath = (name, manipulator) => {
    const path = entries.getPath(name)

    if (path) {
        console.log(manipulatePath(path, manipulator))
    } else {
        console.log(process.cwd())
    }
}

const removeLocation = name => {
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
}

const forgetUsages = () => {
    console.log(
        chalk.green(
            `Successfully reset all usage statistics (${entries.resetUsages()} visits in total).`,
        ),
    )
}

const purge = () => {
    const deletedCount = entries.deleteNonExistingPaths()
    console.log(chalk.green(`Successfully purged ${deletedCount} locations.`))
}

const list = query => {
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
}

const edit = name => {
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
}

const add = name => {
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

        const description = yield prompt('Description: ')
        const path = process.cwd()

        entries.add(name, { description, path })
        console.log(
            chalk.green(
                `Current path (${path}) is now known under the name '${name}'.\nDescription: ${description}`,
            ),
        )
        process.exit(0)
    })
}

module.exports = {
    install,
    getPath,
    removeLocation,
    forgetUsages,
    purge,
    list,
    edit,
    add,
}
