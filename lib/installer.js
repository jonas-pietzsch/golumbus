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

    installGoto: function () {
        var shellName = this.detectShell(),
            issueLink = 'https://github.com/jverhoelen/golumbus';

        switch (shellName) {
            case 'zsh':
                return this.installForZsh();

            case 'fish':
                return this.installForFish();

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
