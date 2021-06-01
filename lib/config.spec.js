const config = require('../lib/config')

const executeLoading = () => config.load(process.cwd() + '/golumbusTest.json')

describe('Config tests', () => {
    describe('Initial state', () => {
        it('Should be undefined initially', () => {
            expect(config.get()).toBeUndefined()
        })
    })

    describe('Loading config file', () => {
        it('Should load the config file without errors with a defined result', () => {
            const result = executeLoading()

            /*result.should.be.an('object')
            expect(result).to.have.property('entries')
            result['entries'].should.be.an('object')*/
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
            expect(testEntry).toEqual({ desc: 'Description', path: process.cwd(), usages: 3 })
        })

        it('Should save the file properly', () => {
            config.save()

            const checkResult = executeLoading()
            /*checkResult.should.be.an('object')
            expect(checkResult).to.have.property('entries')
            checkResult['entries'].should.be.an('object')*/

            const testEntry = config.get().entries['testEntry']
            expect(testEntry).toEqual({ desc: 'Description', path: process.cwd(), usages: 3 })
        })
    })
})
