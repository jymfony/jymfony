require('../../lib/Object/sort');
const { expect } = require('chai');

describe('Sort', function () {

    describe('strings', function () {

        it('sorts by string value', () => {
            expect(Object.sort({ foo: 'action', bar: 'zulu', baz: 'echo' }))
                .to.be.deep.equal({ foo: 'action', baz: 'echo', bar: 'zulu' });
        });

        it('sorts by key', () => {
            expect(Object.ksort({ foo: 'action', bar: 'zulu', baz: 'echo' }))
                .to.be.deep.equal({ bar: 'zulu', baz: 'echo', foo: 'action' });
        });

    });

    describe('numbers', function () {

        it('sorts by string value', () => {
            expect(Object.sort({ foo: 0, bar: 1000, baz: 20 }))
                .to.be.deep.equal({ foo: 0, baz: 20, bar: 1000 });
        });

        it('sorts by key', () => {
            expect(Object.ksort({ 50: 'action', 10: 'zulu', 25: 'echo' }))
                .to.be.deep.equal({ 10: 'zulu', 25: 'echo', 50: 'action' });
        });

    });

    describe('mixed', function () {

        it('sorts by string value', () => {
            expect(Object.sort({ foo: 0, bar: 'echo', baz: 20, foobar: 'zulu' }))
                .to.be.deep.equal({ foo: 0, baz: 20, bar: 'echo', foobar: 'zulu' });
        });

        it('sorts by key', () => {
            expect(Object.ksort({ 'tango': 'action', 10: 'zulu', 25: 'echo', 'sierra': 'foxtrot' }))
                .to.be.deep.equal({ 10: 'zulu', 25: 'echo', 'tango': 'action', 'sierra': 'foxtrot' });
        });

    });
});
