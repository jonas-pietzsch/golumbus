const { manipulatePath } = require('./utils')

describe('utils', () => {
    describe('manipulatePath', () => {
        it('should be concatenated properly', () => {
            const path = '/home/user/work/company/'
            const manipulation = '../../back'

            const expectation = path + manipulation
            const result = manipulatePath(path, manipulation)
            expect(result).toEqual(expectation)
        })
    })
})
