module.exports = {
    sorter: (a, b) => b.usages - a.usages,
    stringContains: (input, query) => input.indexOf(query) > -1,
    getConfigFilePath: () => `${require('path').dirname(require.main.filename)}/golumbus.json`,
    getAsIndexed: (entries) => entries.map(name => this.getTransformedEntry(name, entries[name])),

    getTransformedEntry: (name, entry) => {
        return {
            name,
            desc: entry.desc,
            path: entry.path,
            usages: entry.usages
        }
    },

    manipulatePath: (path, manipulator) => {
        let result = path
        if (!!manipulator) {
            result += ('/' + manipulator)
        }
        return result.replace('//', '/')
    }
}
