require('../fixtures/namespace');
const { expect } = require('chai');
const NoSuchPropertyException = Jymfony.Component.PropertyAccess.Exception.NoSuchPropertyException;
const UnexpectedTypeException = Jymfony.Component.PropertyAccess.Exception.UnexpectedTypeException;
const PropertyAccessor = Jymfony.Component.PropertyAccess.PropertyAccessor;
const Fixtures = Jymfony.Component.PropertyAccess.Fixtures;

describe('[PropertyAccess] PropertyAccessor', function () {
    beforeEach(() => {
        this._accessor = new PropertyAccessor();
    });

    let index = 1;
    const validPropertyPaths = [
        [ [ 'Goofy', 'Mickey' ], '[0]', 'Goofy' ],
        [ [ 'Goofy', 'Mickey' ], '0', 'Goofy' ],
        [ [ 'Goofy', 'Mickey' ], '[1]', 'Mickey' ],
        [ [ 'Goofy', 'Mickey' ], '1', 'Mickey' ],
        [ {firstName: 'Goofy'}, '[firstName]', 'Goofy' ],
        [ {index: {firstName: 'Goofy'}}, '[index][firstName]', 'Goofy' ],
        [ {firstName: 'Goofy'}, 'firstName', 'Goofy' ],
        [ {index: {firstName: 'Goofy'}}, '[index].firstName', 'Goofy' ],
        [ {index: {firstName: 'Goofy'}}, 'index.firstName', 'Goofy' ],
        [ {index: {firstName: 'Goofy'}}, 'index[firstName]', 'Goofy' ],
        [ {'index foo': {firstName: 'Goofy'}}, '[index foo][firstName]', 'Goofy' ],

        // Accessor methods
        [ new Fixtures.TestClass('Goofy'), 'publicProperty', 'Goofy' ],
        [ new Fixtures.TestClass('Goofy'), 'publicAccessor', 'Goofy' ],
        [ new Fixtures.TestClass('Goofy'), 'publicAccessorWithDefaultValue', 'Goofy' ],
        [ new Fixtures.TestClass('Goofy'), 'publicAccessorWithRequiredAndDefaultValue', 'Goofy' ],
        [ new Fixtures.TestClass('Goofy'), 'publicIsAccessor', 'Goofy' ],
        [ new Fixtures.TestClass('Goofy'), 'publicHasAccessor', 'Goofy' ],
        [ new Fixtures.TestClass('Goofy'), 'publicGetSetter', 'Goofy' ],

        // Methods are camelized
        [ new Fixtures.TestClass('Goofy'), 'public_accessor', 'Goofy' ],
        [ new Fixtures.TestClass('Goofy'), '_public_accessor', 'Goofy' ],

        // Special chars
        [ {'%!@$§.': 'Goofy'}, '[%!@$§.]', 'Goofy' ],
        [ {index: {'%!@$§.': 'Goofy'}}, '[index][%!@$§.]', 'Goofy' ],
        [ {'%!@$§': 'Goofy'}, '%!@$§', 'Goofy' ],
        [ {property: {'%!@$§.': 'Goofy'}}, 'property[%!@$§.]', 'Goofy' ],
        [ {property: {'%!@$§': 'Goofy'}}, 'property.%!@$§', 'Goofy' ],

        // Nested objects and arrays
        [ {foo: new Fixtures.TestClass('bar')}, '[foo].publicGetSetter', 'bar' ],
        [ new Fixtures.TestClass({foo: 'bar'}), 'publicGetSetter[foo]', 'bar' ],
        [ new Fixtures.TestClass(new Fixtures.TestClass('bar')), 'publicGetter.publicGetSetter', 'bar' ],
        [ new Fixtures.TestClass({foo: new Fixtures.TestClass('bar')}), 'publicGetter[foo].publicGetSetter', 'bar' ],
        [ new Fixtures.TestClass(new Fixtures.TestClass(new Fixtures.TestClass('bar'))), 'publicGetter.publicGetter.publicGetSetter', 'bar' ],
        [ new Fixtures.TestClass({foo: {baz: new Fixtures.TestClass('bar')}}), 'publicGetter[foo][baz].publicGetSetter', 'bar' ],
    ];

    const pathsWithMissingProperty = [
        [ {firstName: 'Goofy'}, 'lastName' ],
        [ {property: {firstName: 'Goofy'}}, 'property.lastName' ],
        [ {index: {firstName: 'Goofy'}}, '[index].lastName' ],
        [ new Fixtures.TestClass('Goofy'), 'privateProperty' ],

        // Properties are not camelized
        [ new Fixtures.TestClass('Goofy'), 'public_property' ],
    ];

    const pathsWithUnexpectedType = [
        [ '', 'foobar' ],
        [ 'foo', 'foobar' ],
        [ null, 'foobar' ],
        [ 123, 'foobar' ],
        [ {prop: null}, 'prop.foobar' ],
        [ {prop: undefined}, 'prop.foobar' ],
        [ {prop: {subProp: null}}, 'prop.subProp.foobar' ],
        [ {index: null}, '[index][foobar]' ],
        [ {index: {subIndex: null}}, '[index][subIndex][foobar]' ],
    ];

    for (const [ objectOrArray, path, value ] of validPropertyPaths) {
        it ('should get value #' + index++, () => {
            expect(this._accessor.getValue(objectOrArray, path)).to.be.eq(value);
        });
    }

    index = 1;
    for (const [ objectOrArray, path ] of pathsWithMissingProperty) {
        it ('should throw while trying to get non-existent property #' + index++, () => {
            expect(() => this._accessor.getValue(objectOrArray, path)).to.throw(NoSuchPropertyException);
        });
    }

    index = 1;
    for (const [ objectOrArray, path ] of pathsWithUnexpectedType) {
        it('should throw encountering an expected type while getting value #' + index++, () => {
            expect(() => this._accessor.getValue(objectOrArray, path)).to.throw(
                UnexpectedTypeException,
                /PropertyAccessor requires a graph of objects or arrays to operate on/
            );
        });
    }

    index = 1;
    for (const [ objectOrArray, path ] of validPropertyPaths) {
        it ('should set value #' + index++, () => {
            this._accessor.setValue(objectOrArray, path, 'Updated');
            expect(this._accessor.getValue(objectOrArray, path)).to.be.eq('Updated');
        });
    }

    index = 1;
    for (const [ objectOrArray, path ] of pathsWithMissingProperty) {
        it ('should throw while trying to set non-existent property #' + index++, () => {
            expect(() => this._accessor.setValue(objectOrArray, path, 'Updated')).to.throw(NoSuchPropertyException);
        });
    }

    index = 1;
    for (const [ objectOrArray, path ] of pathsWithUnexpectedType) {
        it('should throw encountering an expected type while setting value #' + index++, () => {
            expect(() => this._accessor.setValue(objectOrArray, path, 'Updated')).to.throw(
                UnexpectedTypeException,
                /PropertyAccessor requires a graph of objects or arrays to operate on/
            );
        });
    }
});
