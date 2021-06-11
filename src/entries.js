const fs = require('fs')
const { Config } = require('./config')
const fuzzy = require('fuzzy.js')

class Entries {
    constructor(deps = {}) {
        this.config = deps.config || new Config()
    }

    getAll() {
        return this.config.getContents().entries
    }

    count() {
        return Object.values(this.getAll()).length || 0
    }

    search(query) {
        const results = []

        for (const name in this.getAll()) {
            const entry = this.get(name)
            const containsName = name.includes(query)
            const containsDesc = entry.desc.includes(query)
            const isFuzzyMatch = fuzzy(query || '', name).score > 0

            if (!query || containsName || containsDesc || isFuzzyMatch) {
                results.push({ ...entry, name })
            }
        }

        results.sort((entryA, entryB) => entryB.usages - entryA.usages)
        return results
    }

    add(name, { description: desc, path }) {
        const contents = this.config.getContents()
        contents.entries[name] = { desc, path, usages: 0 }
        this.config.setContents(contents)
    }

    resetUsages() {
        const contents = this.config.getContents()

        let totalUsagesReset = 0
        Object.values(contents.entries).forEach(entry => {
            totalUsagesReset += entry.usages
            entry.usages = 0
        })
        this.config.setContents(contents)

        return totalUsagesReset
    }

    deleteNonExistingPaths() {
        const contents = this.config.getContents()
        const entriesToDelete = Object.keys(contents.entries)
            .map(name => ({
                name,
                path: contents.entries[name].path,
            }))
            .filter(entry => !fs.existsSync(entry.path))

        if (entriesToDelete.length) {
            for (const entry of entriesToDelete) {
                delete contents.entries[entry.name]
            }

            this.config.setContents(contents)
        }

        return entriesToDelete.length
    }

    edit(name, description) {
        const contents = this.config.getContents()
        contents.entries[name].desc = description
        this.config.setContents(contents)
    }

    increaseUsage(name) {
        const contents = this.config.getContents()
        contents.entries[name].usages++
        this.config.setContents(contents)
    }

    delete(name) {
        const contents = this.config.getContents()
        if (contents.entries[name]) {
            delete contents.entries[name]
            this.config.setContents(contents)
        }
    }

    get(name) {
        return this.getAll()[name]
    }

    isKnown(name) {
        return this.get(name) != undefined
    }
}

module.exports = { Entries }
