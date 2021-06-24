const fs = require('fs')
const path = require('path')
const { isWindows } = require('./system')
const { execSync } = require('child_process')
const { detectShell, getUserHome } = require('./system')

const fsOptions = { encoding: 'utf8' }
const appendToFile = (path, content) =>
    fs.appendFileSync(path, content, fsOptions)
const writeToFile = (path, content) =>
    fs.writeFileSync(path, content, fsOptions)
const getFileContents = path => fs.readFileSync(path).toString()

const installForZsh = async () => {
    const zshrcFilename = '/.zshrc'
    const zshrcPath = getUserHome() + zshrcFilename

    if ((getFileContents(zshrcPath) || '').includes('function goto')) {
        return `Zsh command 'goto' is already installed in your ~${zshrcFilename} configuration. 'goto' should be available in your Zsh shell.`
    }

    appendToFile(zshrcPath, `\n${await generateGotoScript('goto.zsh')}`)

    return `Installed the Zsh command into your ~${zshrcFilename} configuration. Open a new terminal to use the 'goto' command.`
}

const installForFish = async () => {
    const fishGotoFunctionFilename = '/.config/fish/functions/goto.fish'
    const fishGotoFunctionPath = getUserHome() + fishGotoFunctionFilename

    if (fs.existsSync(fishGotoFunctionPath)) {
        return `Fish function file ${fishGotoFunctionFilename} already in place. 'goto' command should be present in your Fish shell.`
    }

    writeToFile(fishGotoFunctionPath, await generateGotoScript('goto.fish'))

    return `Created the Fish function file ~${fishGotoFunctionFilename}. Open a new terminal to use the 'goto' command.`
}

const generateGotoScript = async scriptName => {
    return getFileContents(path.join(__dirname, '..', scriptName)).replace(
        'gol',
        await resolveGolumbusBinaryFullPath(),
    )
}

const resolveGolumbusBinaryFullPath = async () => {
    const whichCommand = isWindows() ? 'where' : 'which'

    return execSync(`${whichCommand} gol`)
        .toString()
        .replace(/(\r\n|\n|\r)/gm, '')
}

const installGoto = async shellName => {
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
                (await generateGotoScript('goto.sh')) +
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
    resolveGolumbusBinaryFullPath,
    generateGotoScript,
}
