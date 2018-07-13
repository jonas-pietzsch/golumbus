const chai = require('chai')
const { assert } = chai
const utils = require('./../lib/utils')

// http://stackoverflow.com/a/2450976/5500928
const shuffle = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
    return array
}

const getUsageTestEntries = (count) => {
    let result = []
    for (let i = 0; i < count; i++) {
        result.push({ usages: (i * 2) })
    }
    shuffle(result)
    return result
}

describe('Utils tests', () => {
    describe('Testing the usages-sorter function', () => {
        it('Should sort correctly', () => {
            const usagesArray = getUsageTestEntries(25)
            usagesArray.sort(utils.sorter)

            const highest = usagesArray[0]
            for (let i = 0; i < usagesArray.length; i++) {
                assert.equal(usagesArray[i].usages <= highest.usages, true, 'bla')
            }
        })
    })

    describe('Testing the string contains function', () => {
        it('Indicates "contains" correctly', () => {
            const agileManifestoPart = 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software. Welcome changing requirements, even late in development. Agile processes harness change for the customers competitive advantage.'

            const containedParts = ['Our', 'customer through', 'delivery', 'requirements', 'even late in development']
            const notContainedParts = ['television', 'robots', 'warrrrr', 'Club Mate', 'mice', 'elefants']

            for (let i = 0; i < containedParts.length; i++) {
                const isContaining = utils.stringContains(agileManifestoPart, containedParts[i])
                assert.equal(isContaining, true)
            }

            for (let i = 0; i < notContainedParts.length; i++) {
                const isContaining = utils.stringContains(agileManifestoPart, notContainedParts[i])
                assert.equal(isContaining, false)
            }
        })
    })

    describe('Testing the config file path', () => {
        it('Is expected within a sub directory of the cwd', () => {
            const cwd = process.cwd()
            const result = utils.getConfigFilePath()

            const isInSubDir = utils.stringContains(result, cwd)
            assert.equal(isInSubDir, true)
        })
    })

    describe('Testing transformed entries', () => {
        it('Is transformed in a proper way', () => {
            const inputName = 'myProjects'
            const input = {
                desc: 'My projects in some directory',
                usages: 665,
                path: '/home/guy/Documents/projects'
            }

            const result = utils.getTransformedEntry(inputName, input)
            const expected = input
            expected.name = inputName

            assert.equal(result.name, expected.name)
            assert.equal(result.desc, expected.desc)
            assert.equal(result.path, expected.path)
            assert.equal(result.usages, expected.usages)
        })
    })

    describe('Testing of path manipulations', () => {
        it('Should be concatenated properly', () => {
            const path = '/home/user/work/company/'
            const manipulation = '../../back'

            const expectation = path + manipulation
            const result = utils.manipulatePath(path, manipulation)
            assert.equal(expectation, result, 'that manually built string is correct')
        })
    })
})
