const chai = require('chai')
const { expect, assert } = chai
const should = chai.should()
const config = require('./../lib/config')

const executeLoading = () => config.load(process.cwd() + '/golumbusTest.json')

const checkEntry = (entry) => {
    entry.should.be.an('object')
    assert.equal(entry.desc, 'Description')
    assert.equal(entry.path, process.cwd())
    assert.equal(entry.usages, 3)
}

describe('Config tests', () => {
    describe('Initial state', () => {
        it('Should be undefined initially', () => {
            assert.equal(config.get(), undefined)
        })
    })

    describe('Loading config file', () => {
        it('Should load the config file without errors with a defined result', () => {
            const result = executeLoading()

            result.should.be.an('object')
            expect(result).to.have.property('entries')
            result['entries'].should.be.an('object')
        })
    })

    describe('Saving config file', () => {
        it('Should add a new entry', () => {
            config.get().entries['testEntry'] = {
                desc: 'Description',
                path: process.cwd(),
                usages: 3
            }

            const testEntry = config.get().entries['testEntry']
            checkEntry(testEntry)
        })

        it('Should save the file properly', () => {
            config.save()

            const checkResult = executeLoading()
            checkResult.should.be.an('object')
            expect(checkResult).to.have.property('entries')
            checkResult['entries'].should.be.an('object')

            const testEntry = config.get().entries['testEntry']
            checkEntry(testEntry)
        })
    })
})
