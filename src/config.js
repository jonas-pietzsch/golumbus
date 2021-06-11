const jsonfile = require('jsonfile')
let config
let configFile

const configFilePath = `~/.config/golumbus.json`

class Config {
    constructor() {
        this.config = jsonfile.readFileSync(configFilePath)
    }

    getEntries() {
        return this.config.entries
    }

    getEntry(name) {
        return this.getEntries()[name]
    }

    save() {
        jsonfile.writeFileSync(configFilePath, this.config, { spaces: 2 })
    }
}

module.exports = {
    Config,

    get: () => {
        return config
    },

    load: (file) => {
        configFile = file
        config = jsonfile.readFileSync(configFile)
        return config
    },

    save: () => {
        jsonfile.writeFileSync(configFile, config, {spaces: 2})
    }
}
