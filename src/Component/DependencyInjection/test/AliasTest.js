const Alias = Jymfony.Component.DependencyInjection.Alias;
const InvalidArgumentException = Jymfony.Component.DependencyInjection.Exception.InvalidArgumentException;
const { expect } = require('chai');

describe('[DependencyInjection] Alias', function () {
    it ('could be constructed', () => {
        const alias = new Alias('foo');

        expect(alias.toString()).to.be.equal('foo');
        expect(alias.isPublic()).to.be.equal(false);
    });

    it ('public alias can be constructed', () => {
        const alias = new Alias('foo', true);

        expect(alias.toString()).to.be.equal('foo');
        expect(alias.isPublic()).to.be.equal(true);
    });

    it ('could be set public', () => {
        const alias = new Alias('foo');
        alias.setPublic(true);

        expect(alias.isPublic()).to.be.equal(true);
    });

    it ('could be deprecated', () => {
        const alias = new Alias('foo');
        alias.setDeprecated(true, 'The %alias_id% service is deprecated.');

        expect(alias.isDeprecated()).to.be.equal(true);
    });

    it ('should have a default deprecation message', () => {
        const alias = new Alias('foo');
        alias.setDeprecated();

        const expectedMessage = 'The "foo" service alias is deprecated. You should stop using it, as it will be removed in the future.';
        expect(alias.getDeprecationMessage('foo')).to.be.equal(expectedMessage);
    });

    it ('should compose deprecation message correctly', () => {
        const alias = new Alias('foo');
        alias.setDeprecated(true, 'The "%alias_id%" is deprecated.');

        const expectedMessage = 'The "foo" is deprecated.';
        expect(alias.getDeprecationMessage('foo')).to.be.equal(expectedMessage);
    });

    const invalidDeprecationMessages = {
        'with \rs': 'invalid \r message %alias_id%',
        'with \ns': 'invalid \n message %alias_id%',
        'with */s': 'invalid */ message %alias_id%',
    };

    for (const [ key, value ] of __jymfony.getEntries(invalidDeprecationMessages)) {
        it ('should throw with an invalid deprecation message ' + key, () => {
            const alias = new Alias('foo');
            expect(() => alias.setDeprecated(true, value)).to.throw(InvalidArgumentException);
        });
    }
});
