var fs = require('fs'),
    path = require('path'),
    zshrcFilename = '/.zshrc',
    fishGotoFunctionFilename = '/.config/fish/functions/goto.fish';

module.exports = {
    detectShell: function () {
        var shellPath = process.env.SHELL,
        shellPathSplit = shellPath.split('/'),
        shellName = shellPathSplit[shellPathSplit.length - 1];

        return shellName;
    },

    installGoto: function (shellName) {
        var shellName = shellName ? shellName : this.detectShell(),
            issueLink = 'https://github.com/jverhoelen/golumbus';

        switch (shellName) {
            case 'zsh':
                return this.installForZsh();

            case 'fish':
                return this.installForFish();

            case 'bash':
                return `If you're a plain bash user, please install the following command `
                        + `script your way.\nGolumbus does not want to decide, how you may handle your bash setup.\n\n`
                        + this.getFileContents(path.join(__dirname, '..', 'goto.sh'))
                        + `\nNo idea how to start? Some help: http://www.integralist.co.uk/posts/bash-cli.html`;

            default:
                return `Installation for ${shellName} is not yet supported! Please submit a feature request at ${issueLink}`;
        }
    },

    getUserHome: function () {
        return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    },

    installForZsh: function () {
        var zshGotoPath = path.join(__dirname, '..', 'goto.zsh');
        this.appendToFile(this.getUserHome() + zshrcFilename, '\n' + this.getFileContents(zshGotoPath));

        return `Installed the goto command to your ~${zshrcFilename} configuration. Try in a new terminal window.`;
    },

    installForFish: function () {
        var fishGotoPath = path.join(__dirname, '..', 'goto.fish');
        this.writeToFile(this.getUserHome() + fishGotoFunctionFilename, this.getFileContents(fishGotoPath));

        return `Created the Fish function file ~${fishGotoFunctionFilename}. Try in a new terminal window.`;
    },

    getFileContents: function (filePath) {
        return fs.readFileSync(filePath).toString();
    },

    writeToFile: function (filePath, content) {
        fs.writeFileSync(filePath, content, encoding='utf8');
    },

    appendToFile: function (filePath, content) {
        fs.appendFileSync(filePath, content, encoding='utf8');
    }
};
