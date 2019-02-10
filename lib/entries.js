const fs = require('fs')
const config = require('./config')
const utils = require('./utils')
const fuzzy = require('fuzzy.js')

class Entries {
    constructor() {
        this.entries = []
    }

    loadFrom(file) {
        this.entries = config.load(file).entries
        return this.entries
    }

    all() {
        return this.entries
    }

    count() {
        let count = this.entries.length
        return count ? count : 0
    }

    search(query) {
        let result = []

        for (let name in this.all()) {
            let entry = this.get(name)
            let match = fuzzy(query ? query : '', name)
            let isFuzzyMatch = match.score > 0
            let containsName = utils.stringContains(name, query)
            let containsDesc = utils.stringContains(entry.desc, query)

            if (!query || (containsName || containsDesc || isFuzzyMatch)) {
                result.push(utils.getTransformedEntry(name, entry))
            }
        }

        result.sort(utils.sorter)
        return result
    }

    add(name, entry) {
        this.entries[name] = entry
        this.save()
    }

    resetUsages() {
        let totalAccesses = 0

        for (let name in this.entries) {
            let entry = this.entries[name]
            totalAccesses += entry.usages
            entry.usages = 0
        }

        this.save()
        return totalAccesses
    }

    purgeNotExisting() {
        const entriesToDelete = this.entries.filter(entry => !fs.existsSync(entry.path))
        //entriesToDelete.forEach(entry => this.remove(entry))

        console.log(entriesToDelete)

        return entriesToDelete.length
    }

    edit(name, newDescription) {
        this.get(name).desc = newDescription
        this.save()
    }

    remove(name) {
        delete this.entries[name]
        this.save()
    }

    get(name) {
        return this.all()[name]
    }

    isKnown(name) {
        return this.get(name) != undefined
    }

    save() {
        config.save()
    }
}

module.exports = Entries
