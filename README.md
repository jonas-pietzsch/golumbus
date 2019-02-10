## What is golumbus? [![NPM](https://img.shields.io/npm/v/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/dm/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/l/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus)

It's a command line utility to bookmark locations on your computer.
You can navigate to, add, list, get and remove bookmarked locations.
So, make Golumbus your smart navigator on the wild seas of your computers directory!

![Golumbus demo](https://i.imgsafe.org/ba9acd5.gif)

## Install it

Golumbus is meant to be a command accessible via `go` (or `gol` to escape conflicts with the Go programming language). The command `goto` should be used to hop to locations. Just install it using `npm install -g golumbus`.

*Before first usage, execute `go install` to install the `goto` command for the shell you are using.* Currently Fish and Zsh are supported for auto installation. Bash can be installed manually. For more information, [have a look at the Wiki](https://github.com/jverhoelen/golumbus/wiki/Install-the-goto-command).

## Use it

**Add a location:** `go add <name>`

**List/search your locations:** `go list [query]` (optional search query)

**Remove a location:** `go rm <name>`

**Get a location:** `go <name> [manipulator]` (path to the location returned on stdout)
The manipulator is something like `../tests/../../somewhere` and will be manipulating the location-path directly.

**Jump to a location:** `goto <name> [manipulator]` (you must have installed the goto command therefor)

**Install goto command:** `go install [shell]` (shell is optional and being auto detected, if empty)

**Purge locations without existing directory:** `go purge`

## Contribution

Have a look at [Golumbus' GitHub repository](http://github.com/JonasPriest/golumbus), please. I'm happy about forks, pull-requests or issues created.
