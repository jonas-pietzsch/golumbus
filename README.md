## What is golumbus?

It's a small command line utility to bookmark locations on your machines.
You can add (and overwrite), list, get and remove bookmark locations.
So, make Golumbus your smart navigator to help you sailing between projects, quickly.

## Install it

Golumbus is meant to be a command accessible via `go`, so just install it using
`npm install -g golumbus`

## How to use?

**Add a location:** `go add 'location name'`
You will be prompted for a description of this location.

**List your locations:** `go list`
All your locations will be listed, one per row.

**Remove a location:** `go rm 'location name'`
The location will be removed.

**Get a location:** `go 'location name'`
Golumbus will return the path to the location on stdout.

## Solutions to *really* jump to projects

Scripts have the disadvantage to not really be able to alter parent processes, like the command line you are executing golumbus from.
So unfortunately golumbus has no mechanism to jump to a path *without help*. You probably will need to build a small bridge between Node and the command line (of your choice) which evaluates `go 'name'` and `cd` to it.

### Using the fish shell on OS X

The following represents the config directory of fish. You can maintain a functions directory there and store your custom fish commands defined by functions. To build the bridge in fish, just add my example [golumbus.fish file](golumbus.fish) there.

```
~/.config/fish
├── config.fish
├── fish_history
└── functions
    ├── [all your custom fish function scripts]
    └── golumbus.fish
```


## Ideas? Fixes?

Have a look at [Golumbus' GitHub repository](http://github.com/JonasPriest/golumbus), please.
Leave your scurvy at home, sailor.
