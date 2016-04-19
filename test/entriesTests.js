var chai = require('chai')
var entries = require('./../lib/entries');

var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;

describe('Entries service tests', function () {

    describe('Manages loading using the config', function () {
        it('Returns the loaded entries', function () {
            var real = entries.loadFrom(process.cwd() + '/golumbusTest.json');
            assert.equal(real, entries.all());
        });

    });

    describe('Capabilities to CRUD with entries', function () {

        it('Can be added a new entry', function () {
            var name = 'noodles';
            entries.add(name, {usages: 3, desc: 'My noodles', path: process.cwd()});

            var retrieval = entries.all()[name];
            expect(retrieval).to.be.an('object');
            expect(retrieval.usages).not.to.be.NaN;
            expect(retrieval.path).to.be.a('string');
            expect(retrieval.desc).to.be.a('string');
        });

        it('Knows the previously added entry', function () {
            expect(entries.isKnown('noodles')).is.true;
        });

        it('can edit the previously added entry', function () {
            var newDesc = 'Some new description';
            entries.edit('noodles', newDesc);
            expect(entries.get('noodles').desc).to.equal(newDesc);
        });

        it('can remove the previously added entry', function () {
            expect(entries.isKnown('noodles')).is.true;
            entries.remove('noodles');
            expect(entries.isKnown('noodles')).is.false;
        });

    });
});
