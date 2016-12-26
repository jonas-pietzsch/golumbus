## What is golumbus? [![NPM](https://img.shields.io/npm/v/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/dm/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/l/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus)

It's a small command line utility to bookmark locations on your machines.
You can add (and overwrite), list, get and remove bookmark locations.
So, make Golumbus your smart navigator to help you sailing between projects, quickly.

![Golumbus demo](https://i.imgsafe.org/ba9acd5.gif)

## Install it

Golumbus is meant to be a command accessible via `go` (or `gol` to escape conflicts with Go Lang) and `goto`, so just install it using `npm install -g golumbus`.

## Use it

**Add a location:** `go add <name>`

**List/search your locations:** `go list [query]` (optional search query)

**Remove a location:** `go rm <name>`

**Get a location:** `go <name> [manipulator]` (path to the location returned on stdout)
The manipulator is something like `../tests/../../somewhere` and will be manipulating the location-path directly.

**Jump to a location:** `goto <name> [manipulator]` (jump to the location in your shell - *please read the next section for setup*)

## Setting up project jumping

Scripts have the disadvantage to not really be able to alter parent processes, like the command line you are executing golumbus from.
So unfortunately golumbus has no mechanism to jump to a path *without help*. You probably will need to *build a small bridge between Node and the shell*.

#### Bash

Simply add a script named `goto` to your path that does something like [that](goto.sh).

#### Zsh

Add the [Zsh goto script](goto.zsh) to your `~/.zshrc`.

#### Fish Shell

Copy [goto.fish](goto.fish) to your Fish Shell function directory which is `~/.config/fish/functions`.


## Contribution

Have a look at [Golumbus' GitHub repository](http://github.com/JonasPriest/golumbus), please. I'm happy about forks, pull-requests or issues.

But: Leave your scurvy at home, sailor.
