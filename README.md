## What is golumbus? [![NPM](https://img.shields.io/npm/v/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/dm/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/l/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus)

It's a small command line utility to bookmark locations on your machines.
You can add (and overwrite), list, get and remove bookmark locations.
So, make Golumbus your smart navigator to help you sailing between projects, quickly.

![Golumbus demo](https://i.imgsafe.org/ba9acd5.gif)

## Install it

Golumbus is meant to be a command accessible via `go` (or `gol` to escape conflicts with Go Lang) and `goto`, so just install it using `npm install -g golumbus`.

*Before first usage, execute `go install` to install the `goto` command for the shell you are using.* Currently Fish and Zsh are supported for auto installation. Bash can be installed manually. For more information, [have a look at the Wiki](https://github.com/jverhoelen/golumbus/wiki/Install-the-goto-command).

## Use it

**Add a location:** `go add <name>`

**List/search your locations:** `go list [query]` (optional search query)

**Remove a location:** `go rm <name>`

**Get a location:** `go <name> [manipulator]` (path to the location returned on stdout)
The manipulator is something like `../tests/../../somewhere` and will be manipulating the location-path directly.

**Jump to a location:** `goto <name> [manipulator]` (you must have installed the goto command therefor)

**Install goto command:** `go install [shell]` (shell is optional and being auto detected, when empty)

## Contribution

Have a look at [Golumbus' GitHub repository](http://github.com/JonasPriest/golumbus), please. I'm happy about forks, pull-requests or issues.

But: Leave your scurvy at home, sailor.
