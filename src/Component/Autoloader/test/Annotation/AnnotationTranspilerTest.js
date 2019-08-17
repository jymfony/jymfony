const { expect } = require('chai');
const { join } = require('path');

/*
 * We are testing autoloader component here
 * Cannot use the autoloader itself to load classes! :)
 */
require('../../src/Autoloader');
const Namespace = require('../../src/Namespace');

describe('[Autoloader] Annotations transpiler', () => {
    afterEach(() => {
        delete global.Foo;
    });

    it('should transpile annotations', () => {
        global.Foo = new Namespace(__jymfony.autoload, 'Foo', join(__dirname, '..', '..', 'fixtures'), require);
        const a = new Foo.Annotated();
        const r = new ReflectionClass(a);

        expect(r.annotations).to.have.lengthOf(1);
        expect(r.annotations[0]).to.be.instanceOf(Foo.FooAnnot);
        expect(r.annotations[0]._values).to.be.deep.equal({ value: 12 });

        expect(r.getField('_value').annotations).to.be.deep.equal([ { _values: { prop: 'test' } } ]);
        expect(r.getMethod('getValue').annotations).to.be.deep.equal([ { _values: {} } ]);
        expect(r.getReadableProperty('value').annotations).to.be.deep.equal([ { _values: null } ]);
    });
});
