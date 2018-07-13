const jsonfile = require('jsonfile')
let config
let configFile

module.exports = {
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
