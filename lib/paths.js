
module.exports = {
    manipulate: function (path, manipulator) {
        var result = path;
        if (manipulator) {
            result += ('/' + manipulator);
        }
        return result.replace('//', '/');
    }
};
