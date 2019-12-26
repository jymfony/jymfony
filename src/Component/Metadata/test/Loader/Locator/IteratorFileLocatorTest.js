const IteratorFileLocator = Jymfony.Component.Metadata.Loader.Locator.IteratorFileLocator;
const { normalize } = require('path');
const { expect } = require('chai');

describe('[Metadata] IteratorFileLocator', function () {
    it ('locate should return correct results', () => {
        const iterator = new IteratorFileLocator();
        const result = [ ...iterator.locate(normalize(__dirname + '/../../../fixtures/Locator'), '.yaml') ].sort();

        expect(result).to.deep.equal([
            normalize(__dirname + '/../../../fixtures/Locator/config/config.yaml'),
            normalize(__dirname + '/../../../fixtures/Locator/src/AppBundle/config/configuration.yaml'),
        ]);
    });

    it ('locate should throw on invalid extension', () => {
        const iterator = new IteratorFileLocator();
        expect(() => iterator.locate(__dirname, 'base.yaml')).to.throw(InvalidArgumentException);
    });
});
