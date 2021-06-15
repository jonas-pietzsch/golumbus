# Golumbus [![NPM](https://img.shields.io/npm/v/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/dm/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus) [![NPM](https://img.shields.io/npm/l/golumbus.svg?style=flat-square)](https://npmjs.com/golumbus)

Golumbus lets you bookmark directories and jump to them quickly on your terminal.

## Installation

1. `npm install -g golumbus` (installs the `gol` command)
2. Run `gol install` to install the `goto` command in your shell (Bash, Zsh, Fish)

[Why do I need to install two commands?](https://github.com/jverhoelen/golumbus/wiki/Install-the-goto-command)

## Usage

Use the `gol` command to manage (add, search, delete) your bookmarked directories:

1. Bookmark current directory: `gol add <name>`
2. List your directories: `gol list [search-term]`
3. Resolve a directory to stdout: `gol <name> [path-manipulator]` 
4. Remove a directory: `gol rm <name>`
5. Purge directories not existing anymore: `gol purge`

**Jump to a bookmarked location**: `goto <name>`

## Contribution

I'm looking forward to any feedback, issue reports or pull requests.
