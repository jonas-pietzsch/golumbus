#!/usr/bin/env node

const {
    install,
    getPath,
    removeLocation,
    forgetUsages,
    purge,
    list,
    edit,
    add,
} = require('./src/cliActions')
const program = require('commander')

program.version(require('./package.json').version)

// command definitions
program
    .command('list [query]')
    .description(
        "Lists all known locations. Searches them when providing 'query'",
    )
    .action(list)

program
    .arguments('<name> [manipulator]')
    .description(
        'Output the location known under this name. If location not known, current working directory is returned.',
    )
    .action(getPath)

program
    .command('rm <name>')
    .description('Remove the location known under this name, if existing')
    .action(removeLocation)

program
    .command('forget')
    .description('Forget usage statistics of all locations')
    .action(forgetUsages)

program
    .command('purge')
    .description(
        'Purges all bookmarks which do not have existing directories in the file system anymore',
    )
    .action(purge)

program
    .command('install [shell]')
    .description(
        "Detects your shell and installs the goto command for it. If 'shell' parameter provided, installs command for this shell.",
    )
    .action(install)

program
    .command('edit <name>')
    .description('Edit the location known under this name')
    .action(edit)

program
    .command('add <name>')
    .description('Add the currently visited location as known one under a name')
    .action(add)

program.parse(process.argv)
