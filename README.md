## What is golumbus? [![NPM](https://img.shields.io/npm/v/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/dm/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/l/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus)

It's a command line utility to bookmark locations on your computer.
You can navigate to, add, list, get and remove bookmarked locations.
So, make Golumbus your smart navigator on the wild seas of your computers directory!

## Install it

Golumbus is usable through the `gol` command. The command `goto` should be used to hop to locations and need to be installed seperately. Just install it using `npm install -g golumbus`.

_Before first usage, execute `gol install` to install the `goto` command for the shell you are using._ Currently Fish and Zsh are supported for auto installation. Bash can be installed manually. For more information, [have a look at the Wiki](https://github.com/jverhoelen/golumbus/wiki/Install-the-goto-command).

## Use it

**Add a location:** `gol add <name>`

**List/search your locations:** `gol list [query]` (optional search query)

**Remove a location:** `gol rm <name>`

**Get a location:** `gol <name> [manipulator]` (path to the location returned on stdout)
The manipulator is something like `../tests/../../somewhere` and will be manipulating the location-path directly.

**Jump to a location:** `goto <name> [manipulator]` (you must have installed the goto command therefor)

**Install goto command:** `gol install [shell]` (shell is optional and being auto detected, if empty)

**Purge locations without existing directory:** `gol purge`

## Contribution

Have a look at [Golumbus' GitHub repository](http://github.com/jverhoelen/golumbus), please. I'm happy about forks, pull-requests or issues created.
