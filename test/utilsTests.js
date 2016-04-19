var chai = require('chai')
var mocha = require('mocha');
var utils = require('./../lib/utils');

var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

// http://stackoverflow.com/a/2450976/5500928
var shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var getUsageTestEntries = function (count) {
    var result = [];
    for (var i = 0; i < count; i++) {
        result.push({usages: (i * 2)});
    }
    shuffle(result);
    return result;
}

describe('Utils tests', function () {

    describe('Testing the usages-sorter function', function () {
        it('Should sort correctly', function () {
            var usagesArray = getUsageTestEntries(25);

            usagesArray.sort(utils.sorter);

            var highest = usagesArray[0];
            for (var i = 0; i < usagesArray.length; i++) {
                assert.equal(usagesArray[i].usages <= highest.usages, true, 'bla');
            }
        });
    });

    describe('Testing the string contains function', function () {
        it('Indicates "contains" correctly', function () {
            var agileManifestoPart = 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software. Welcome changing requirements, even late in development. Agile processes harness change for the customers competitive advantage.';

            var containedParts = ['Our', 'customer through', 'delivery', 'requirements', 'even late in development'];
            var notContainedParts = ['television', 'robots', 'warrrrr', 'Club Mate', 'mice', 'elefants'];

            for (var i = 0; i < containedParts.length; i++) {
                var isContaining = utils.stringContains(agileManifestoPart, containedParts[i]);
                assert.equal(isContaining, true);
            }

            for (var i = 0; i < notContainedParts.length; i++) {
                var isContaining = utils.stringContains(agileManifestoPart, notContainedParts[i]);
                assert.equal(isContaining, false);
            }
        });
    });

    describe('Testing the config file path', function () {
        it('Is expected within a sub directory of the cwd', function () {
            var cwd = process.cwd();
            var result = utils.getConfigFilePath();

            var isInSubDir = utils.stringContains(result, cwd);
            assert.equal(isInSubDir, true);
        });
    });

    describe('Testing transformed entries', function () {
        it('Is transformed in a proper way', function () {
            var inputName = 'myProjects';
            var input = {
                desc: 'My projects in some directory',
                usages: 665,
                path: '/home/guy/Documents/projects'
            };

            var result = utils.getTransformedEntry(inputName, input);
            var expected = input;
            expected.name = inputName;

            assert.equal(result.name, expected.name);
            assert.equal(result.desc, expected.desc);
            assert.equal(result.path, expected.path);
            assert.equal(result.usages, expected.usages);
        });
    });

});
