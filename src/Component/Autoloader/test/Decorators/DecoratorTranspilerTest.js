const { expect } = require('chai');
const { join } = require('path');

/*
 * We are testing autoloader component here
 * Cannot use the autoloader itself to load classes! :)
 */
require('../../src/Autoloader');
const Namespace = require('../../src/Namespace');
const fixturesDir = join(__dirname, '..', '..', 'fixtures');

describe('[Autoloader] Annotations transpiler', () => {
    afterEach(() => {
        delete global.Foo;
    });

    it('should transpile annotations', __jymfony.Platform.hasPublicFieldSupport() ? () => {
        global.Foo = new Namespace(__jymfony.autoload, 'Foo', fixturesDir, require);
        const a = new Foo.Annotated();
        const r = new ReflectionClass(a);

        const annotation = new ReflectionClass(Foo.FooAnnot).getConstructor();

        expect(r.metadata).to.have.lengthOf(1);
        expect(r.metadata[0][0]).to.be.eq(annotation);
        expect(r.metadata[0][1]).to.be.instanceOf(Foo.FooAnnot);
        expect(r.metadata[0][1]._values).to.be.deep.equal({ value: 24 });

        expect(r.getField('_value').metadata).to.be.deep.equal([ [ annotation, { _values: { prop: 'test' } } ] ]);
        expect(r.getMethod('getValue').metadata).to.be.deep.equal([ [ annotation, { _values: {} } ] ]);
        expect(r.getReadableProperty('value').metadata).to.be.deep.equal([ [ annotation, { _values: null } ] ]);
    } : undefined);

    it ('should transpile initialize decorators', () => {
        global.Foo = new Namespace(__jymfony.autoload, 'Foo', fixturesDir, require);
        new Foo.Decorators.Initialize();

        expect(Foo.Decorators.Initialize.initializations).to.be.deep.equal([
            [ 'property', undefined ],
            [ 'computedProperty', undefined ],
            [ 'propertyWithDefault', 'default' ],
            [ 'method', undefined ],
            [ undefined, undefined ],
        ]);
    });

    it ('should transpile register decorators', () => {
        global.Foo = new Namespace(__jymfony.autoload, 'Foo', fixturesDir, require);
        new Foo.Decorators.Register();

        expect(Foo.Decorators.Register.registrations).to.be.deep.equal([
            undefined,
            '$property',
            '$propertyWithDefault',
            'property',
            'computedProperty',
            'propertyWithDefault',
            '#privateProperty',
            'staticMethod',
            'method',
        ]);
    });
});
