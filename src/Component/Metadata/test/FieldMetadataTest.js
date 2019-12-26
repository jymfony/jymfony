require('../fixtures/namespace');
const Fixtures = Jymfony.Component.Metadata.Fixtures;
const { expect } = require('chai');

describe('[Metadata] FieldMetadata', function () {
    it ('could unserialize virtual fields', () => {
        const vf = new Fixtures.VirtualFieldMetadata(Fixtures.ClassForMetadata, 'nonExistentAttribute');
        const unserialized = __jymfony.unserialize(__jymfony.serialize(vf));

        expect(unserialized.value).to.be.equal('FOO_BAR');
        expect(() => unserialized.reflection).to.throw(ReflectionException);
    });
});
