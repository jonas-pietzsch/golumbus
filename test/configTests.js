var chai = require('chai')
var config = require('./../lib/config');
var utils = require('./../lib/utils');

var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

var executeLoading = function () {
    return config.load(process.cwd() + '/golumbusTest.json');
};

var checkEntry = function (entry) {
    entry.should.be.an('object');
    assert.equal(entry.desc, 'Description');
    assert.equal(entry.path, process.cwd());
    assert.equal(entry.usages, 3);
};

describe('Config tests', function () {
    describe('Initial state', function () {
        it('Should be undefined initially', function () {
            assert.equal(config.get(), undefined);
        });
    });

    describe('Loading config file', function () {
        it('Should load the config file without errors with a defined result', function () {
            var result = executeLoading();

            result.should.be.an('object');
            expect(result).to.have.property('entries');
            result['entries'].should.be.an('object');
        });
    });

    describe('Saving config file', function () {
        it('Should add a new entry', function () {
            config.get().entries['testEntry'] = {
                desc: 'Description',
                path: process.cwd(),
                usages: 3
            };

            var testEntry = config.get().entries['testEntry'];
            checkEntry(testEntry);
        });

        it('Should save the file properly', function () {
            config.save();

            var checkResult = executeLoading();
            checkResult.should.be.an('object');
            expect(checkResult).to.have.property('entries');
            checkResult['entries'].should.be.an('object');

            var testEntry = config.get().entries['testEntry'];
            checkEntry(testEntry);
        });
    });
});
