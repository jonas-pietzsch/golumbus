const getUserHome = () => {
    const isWindows = process.platform === 'win32'
    return process.env[isWindows ? 'USERPROFILE' : 'HOME']
}

const detectShell = () => {
    const shellPath = process.env.SHELL
    const shellPathSplit = shellPath.split('/')
    const shellName = shellPathSplit[shellPathSplit.length - 1]

    return shellName
}

module.exports = {
    detectShell,
    getUserHome,
}
