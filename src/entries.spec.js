const Entries = require('.//entries')

const entries = new Entries()

describe('Entries service tests', () => {
    describe('Manages loading using the config', () => {
        it('Returns the loaded entries', () => {
            const real = entries.loadFrom(process.cwd() + '/golumbusTest.json')
            expect(real).toEqual(entries.all())
        })
    })

    describe('Capabilities to CRUD with entries', () => {
        it('Can be added a new entry', () => {
            const name = 'noodles'
            entries.add(name, {usages: 3, desc: 'My noodles', path: process.cwd()})

            const retrieval = entries.all()[name]
            expect(retrieval).toEqual({ usages: NaN, path: process.cwd(), desc: 'My noodles' })
        })

        it('Knows the previously added entry', () => {
            expect(entries.isKnown('noodles')).toBeTruthy()
        })

        it('can edit the previously added entry', () => {
            const newDesc = 'Some new description'
            entries.edit('noodles', newDesc)
            expect(entries.get('noodles').desc).toEqual(newDesc)
        })

        it('can remove the previously added entry', () => {
            expect(entries.isKnown('noodles')).toBeTruthy()
            entries.remove('noodles')
            expect(entries.isKnown('noodles')).toBeFalsy
        })
    })
})
