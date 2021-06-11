const fs = require('fs')
const path = require('path')
const { detectShell, getUserHome } = require('./system')
const zshrcFilename = '/.zshrc'
const fishGotoFunctionFilename = '/.config/fish/functions/goto.fish'

const fsOptions = { encoding: 'utf8' }
const appendToFile = (path, content) =>
    fs.appendFileSync(path, content, fsOptions)
const writeToFile = (path, content) =>
    fs.writeFileSync(path, content, fsOptions)
const getFileContents = path => fs.readFileSync(path).toString()

module.exports = {
    installGoto: shellName => {
        const guessedShellName = shellName || detectShell()
        const issueLink = 'https://github.com/jverhoelen/golumbus'

        switch (guessedShellName) {
            case 'zsh':
                return this.installForZsh()

            case 'fish':
                return this.installForFish()

            case 'bash':
                return (
                    `If you're primarily using bash, please install the following command ` +
                    `your own way.\nGolumbus does not want to decide how to handle your bash setup.\n\n` +
                    getFileContents(path.join(__dirname, '..', 'goto.sh')) +
                    `\nNo idea how to start? Some help: http://www.integralist.co.uk/posts/bash-cli.html`
                )

            default:
                return `Installation for ${guessedShellName} is not yet supported! Please submit a feature request at ${issueLink}`
        }
    },

    installForZsh: () => {
        const zshGotoPath = path.join(__dirname, '..', 'goto.zsh')
        appendToFile(
            getUserHome() + zshrcFilename,
            '\n' + getFileContents(zshGotoPath),
        )

        return `Installed the goto command to your ~${zshrcFilename} configuration. Try in a new terminal window.`
    },

    installForFish: () => {
        const fishGotoPath = path.join(__dirname, '..', 'goto.fish')
        writeToFile(
            getUserHome() + fishGotoFunctionFilename,
            getFileContents(fishGotoPath),
        )

        return `Created the Fish function file ~${fishGotoFunctionFilename}. Try in a new terminal window.`
    },
}
