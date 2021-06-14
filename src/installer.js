const fs = require('fs')
const path = require('path')
const { detectShell, getUserHome } = require('./system')

const fsOptions = { encoding: 'utf8' }
const appendToFile = (path, content) =>
    fs.appendFileSync(path, content, fsOptions)
const writeToFile = (path, content) =>
    fs.writeFileSync(path, content, fsOptions)
const getFileContents = path => fs.readFileSync(path).toString()

const installForZsh = () => {
    const zshrcFilename = '/.zshrc'
    const zshGotoPath = path.join(__dirname, '..', 'goto.zsh')
    appendToFile(
        getUserHome() + zshrcFilename,
        `\n${getFileContents(zshGotoPath)}`,
    )

    return `Installed the Zsh command into your ~${zshrcFilename} configuration. Open a new terminal to use the 'goto' command.`
}

const installForFish = () => {
    const fishGotoFunctionFilename = '/.config/fish/functions/goto.fish'
    const fishGotoFunctionPath = getUserHome() + fishGotoFunctionFilename

    if (fs.existsSync(fishGotoFunctionPath)) {
        return `Fish function file ${fishGotoFunctionFilename} already in place. 'goto' command should be present in your Fish shell.`
    }

    writeToFile(
        fishGotoFunctionPath,
        getFileContents(path.join(__dirname, '..', 'goto.fish')),
    )

    return `Created the Fish function file ~${fishGotoFunctionFilename}. Open a new terminal to use the 'goto' command.`
}

const installGoto = shellName => {
    const guessedShellName = shellName || detectShell()
    const issueLink = 'https://github.com/jverhoelen/golumbus'

    switch (guessedShellName) {
        case 'zsh':
            return installForZsh()

        case 'fish':
            return installForFish()

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
}

module.exports = {
    installGoto,
    installForZsh,
    installForFish,
}
