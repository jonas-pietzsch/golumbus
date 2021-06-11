module.exports = {
    manipulatePath: (path, manipulator) => {
        let result = path
        if (!!manipulator) {
            result += '/' + manipulator
        }
        return result.replace('//', '/')
    },
}
