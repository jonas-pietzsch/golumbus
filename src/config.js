const jsonfile = require('jsonfile')
const { getUserHome } = require('./system')

class Config {
    constructor() {
        this.configFilePath = `${getUserHome()}/.config/golumbus.json`
        try {
            this.data = jsonfile.readFileSync(this.configFilePath)
        } catch (error) {
            this.data = { entries: {} }
            this.save()
        }
    }

    getContents() {
        return this.data
    }

    setContents(config) {
        this.data = config
        this.save()
    }

    save() {
        jsonfile.writeFileSync(this.configFilePath, this.getContents(), {
            spaces: 4,
        })
    }
}

module.exports = { Config }
