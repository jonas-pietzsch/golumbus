const fs = require('fs')
const path = require('path')
const zshrcFilename = '/.zshrc'
const fishGotoFunctionFilename = '/.config/fish/functions/goto.fish'

module.exports = {
    detectShell: () => {
        const shellPath = process.env.SHELL,
            shellPathSplit = shellPath.split('/'),
            shellName = shellPathSplit[shellPathSplit.length - 1]

        return shellName
    },

    installGoto: (shellName) => {
        const guessedShellName = shellName ? shellName : this.detectShell(),
            issueLink = 'https://github.com/jverhoelen/golumbus'

        switch (guessedShellName) {
            case 'zsh':
                return this.installForZsh()

            case 'fish':
                return this.installForFish()

            case 'bash':
                return `If you're a plain bash user, please install the following command `
                    + `script your way.\nGolumbus does not want to decide, how you may handle your bash setup.\n\n`
                    + this.getFileContents(path.join(__dirname, '..', 'goto.sh'))
                    + `\nNo idea how to start? Some help: http://www.integralist.co.uk/posts/bash-cli.html`

            default:
                return `Installation for ${guessedShellName} is not yet supported! Please submit a feature request at ${issueLink}`
        }
    },

    getUserHome: () => {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
    },

    installForZsh: () => {
        const zshGotoPath = path.join(__dirname, '..', 'goto.zsh')
        this.appendToFile(this.getUserHome() + zshrcFilename, '\n' + this.getFileContents(zshGotoPath))

        return `Installed the goto command to your ~${zshrcFilename} configuration. Try in a new terminal window.`
    },

    installForFish: () => {
        const fishGotoPath = path.join(__dirname, '..', 'goto.fish')
        this.writeToFile(this.getUserHome() + fishGotoFunctionFilename, this.getFileContents(fishGotoPath))

        return `Created the Fish function file ~${fishGotoFunctionFilename}. Try in a new terminal window.`
    },

    getFileContents: (filePath) => {
        return fs.readFileSync(filePath).toString()
    },

    writeToFile: (filePath, content) => {
        fs.writeFileSync(filePath, content, encoding = 'utf8')
    },

    appendToFile: (filePath, content) => {
        fs.appendFileSync(filePath, content, encoding = 'utf8')
    }
}
