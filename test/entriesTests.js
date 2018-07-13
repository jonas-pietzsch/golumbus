const chai = require('chai')
const { expect, assert } = chai
const Entries = require('./../lib/entries')

const entries = new Entries()

describe('Entries service tests', () => {
    describe('Manages loading using the config', () => {
        it('Returns the loaded entries', () => {
            const real = entries.loadFrom(process.cwd() + '/golumbusTest.json')
            assert.equal(real, entries.all())
        })
    })

    describe('Capabilities to CRUD with entries', () => {
        it('Can be added a new entry', () => {
            const name = 'noodles'
            entries.add(name, {usages: 3, desc: 'My noodles', path: process.cwd()})

            const retrieval = entries.all()[name]
            expect(retrieval).to.be.an('object')
            expect(retrieval.usages).not.to.be.NaN
            expect(retrieval.path).to.be.a('string')
            expect(retrieval.desc).to.be.a('string')
        })

        it('Knows the previously added entry', () => {
            expect(entries.isKnown('noodles')).is.true
        })

        it('can edit the previously added entry', () => {
            const newDesc = 'Some new description'
            entries.edit('noodles', newDesc)
            expect(entries.get('noodles').desc).to.equal(newDesc)
        })

        it('can remove the previously added entry', () => {
            expect(entries.isKnown('noodles')).is.true
            entries.remove('noodles')
            expect(entries.isKnown('noodles')).is.false
        })
    })
})
