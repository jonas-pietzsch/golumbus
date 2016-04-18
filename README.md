## What is golumbus?

It's a small command line utility to bookmark locations on your machines.
You can add (and overwrite), list, get and remove bookmark locations.
So, make Golumbus your smart navigator to help you sailing between projects, quickly.

![Golumbus demo](https://i.imgsafe.org/ba9acd5.gif)

## Install it

Golumbus is meant to be a command accessible via `go`, so just install it using
`npm install -g golumbus`

## How to use?

**Add a location:** `go add 'location name'` (you will be prompted for a description)

**List/search your locations:** `go list [query]` (query is optional and searches names and descriptions)

**Remove a location:** `go rm 'location name'`

**Get a location:** `go 'location name'` (path to the location returned on stdout)

## Setting up project jumping (cd)

Scripts have the disadvantage to not really be able to alter parent processes, like the command line you are executing golumbus from.
So unfortunately golumbus has no mechanism to jump to a path *without help*. You probably will need to build a small bridge between Node and the command line (of your choice) which evaluates `go 'name'` and `cd` to it.

#### With bash

Simply add a script named `goto` to your path that does something like [that](goto.sh).

#### fish shell (OS X)

The following represents the config directory of fish. You can maintain a functions directory there and store your custom fish commands defined by functions. To build the bridge in fish, just add my example [goto.fish file](goto.fish) there.

```
~/.config/fish
├── config.fish
├── fish_history
└── functions
    ├── [all your custom fish function scripts]
    └── goto.fish
```


## Ideas? Fixes?

Have a look at [Golumbus' GitHub repository](http://github.com/JonasPriest/golumbus), please. You are happy to make forks, pull-requests or issues. Especially regarding the `cd` problem on a scripts parent process I appreciate your comments and bridges for the command line of your choice.
Leave your scurvy at home, sailor.
