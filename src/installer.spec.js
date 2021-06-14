const fs = require('fs')
const { installForFish, installForZsh, installGoto } = require('./installer')
const { detectShell, getUserHome } = require('./system')
jest.mock('fs')
jest.mock('./system')

describe('installer', () => {
    beforeEach(() => {
        jest.resetAllMocks()
        getUserHome.mockReturnValue('/Users/someUser')
        fs.readFileSync.mockReturnValue('zsh script')
    })

    describe('installForFish', () => {
        it('should write fish script to file', () => {
            installForFish()

            expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
        })
    })

    describe('installForZsh', () => {
        it('should append zsh function to file', () => {
            installForZsh()

            expect(fs.appendFileSync).toHaveBeenCalledTimes(1)
        })
    })

    describe('installGoto', () => {
        it('should install command for specific shell name "zsh"', () => {
            installGoto('zsh')

            expect(fs.appendFileSync).toHaveBeenCalledTimes(1)
        })

        it('should install command for specific shell name "fish"', () => {
            installGoto('fish')

            expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
        })

        it('should auto-detect shell "zsh" and install', () => {
            detectShell.mockReturnValue('zsh')

            installGoto(undefined)

            expect(fs.appendFileSync).toHaveBeenCalledTimes(1)
        })
    })
})
