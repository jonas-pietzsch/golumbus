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
        it('should write fish script to file if not existing yet', () => {
            fs.existsSync.mockReturnValue(false)

            const result = installForFish()

            expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
            expect(result).toEqual(
                "Created the Fish function file ~/.config/fish/functions/goto.fish. Open a new terminal to use the 'goto' command.",
            )
        })

        it('should not write fish script if already existing', () => {
            fs.existsSync.mockReturnValue(true)

            const result = installForFish()

            expect(fs.writeFileSync).not.toHaveBeenCalled()
            expect(result).toEqual(
                "Fish function file /.config/fish/functions/goto.fish already in place. 'goto' command should be present in your Fish shell.",
            )
        })
    })

    describe('installForZsh', () => {
        it('should append zsh function to file', () => {
            installForZsh()

            expect(fs.appendFileSync).toHaveBeenCalledTimes(1)
        })

        it('should not append zsh function to file if function already present there', () => {
            fs.readFileSync = jest.fn().mockImplementation(fileName => {
                if (fileName === '/Users/someUser/.zshrc') {
                    return 'function goto() {\ncd $(gol "$1" "$2")\n}\n'
                } else {
                    return 'zsh script'
                }
            })

            installForZsh()

            expect(fs.appendFileSync).not.toHaveBeenCalled()
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
