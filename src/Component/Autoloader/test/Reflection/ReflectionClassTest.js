const expect = require('chai').expect;

/*
 * We are testing autoloader component here
 * cannot use the autoloader itself to load classes! :)
 */
require('../../src/Reflection/ReflectionClass');

class GrandParent {
    get readProp() { }
    set writeProp(v) { }
}
class Parent extends GrandParent {
    parentMethod() { }
}
const ISon = getInterface(class SonInterface {
    getFoo() { }
});
const ISon2 = getInterface(class Son2Interface {});

class Son extends mix(Parent, ISon) {
    constructor() {
        super(); this.foo = 'bar';
    }

    getFoo() { }

    get prop() { }
    set prop(v) { }
}

class Son2 extends mix(Parent, ISon, ISon2) {
    constructor() {
        super(); this.foo = 'bar';
    }

    getFoo() { }

    get prop() { }
    set prop(v) { }
}

Son2[Symbol.reflection] = {
    fqcn: 'FooNs.Son2',
    namespace: undefined,
    filename: __filename,
    module: module,
    constructor: Son2,
    isModule: (val) => {
        return val === Son2;
    },
};

Parent.CONST_1 = 'foobar';
Son.CONST_2 = 'foo';

describe('[Autoloader] ReflectionClass', function () {
    it('newInstance should return an object', () => {
        const reflClass = new ReflectionClass(Son);
        const obj = reflClass.newInstance();

        expect(obj).not.to.be.undefined;
        expect(obj).to.be.instanceOf(Son);
        expect(obj.foo).to.be.equal('bar');
    });

    it('newInstanceWithoutConstructor should return an object', () => {
        const reflClass = new ReflectionClass(Son);
        const obj = reflClass.newInstanceWithoutConstructor();

        expect(obj).not.to.be.undefined;
        expect(obj).to.be.instanceOf(Son);
        expect(obj.foo).to.be.undefined;
    });

    it('newInstanceWithoutConstructor should not break instanceof chain', () => {
        const reflClass = new ReflectionClass(Son);
        const obj = reflClass.newInstanceWithoutConstructor();

        expect(obj).to.be.instanceOf(Son);
        expect(obj).to.be.instanceOf(Parent);
        expect(obj).to.be.instanceOf(GrandParent);
        expect(obj).to.be.instanceOf(ISon);
    });

    it('newInstanceWithoutConstructor should return correct class name', () => {
        const reflClass = new ReflectionClass(Son2);
        const obj = reflClass.newInstanceWithoutConstructor();

        expect((new ReflectionClass(obj)).name).to.be.equal('FooNs.Son2');
    });

    it('hasMethod should work', () => {
        const reflClass = new ReflectionClass(Son);

        expect(reflClass.hasMethod('parentMethod')).to.be.true;
    });

    it('hasProperty should work', () => {
        const reflClass = new ReflectionClass(Son);

        expect(reflClass.hasProperty('prop')).to.be.true;
        expect(reflClass.hasProperty('readProp')).to.be.true;
        expect(reflClass.hasProperty('writeProp')).to.be.true;
    });

    it('hasReadableProperty should work', () => {
        const reflClass = new ReflectionClass(Son);

        expect(reflClass.hasReadableProperty('prop')).to.be.true;
        expect(reflClass.hasReadableProperty('readProp')).to.be.true;
        expect(reflClass.hasReadableProperty('writeProp')).to.be.false;
    });

    it('hasWritableProperty should work', () => {
        const reflClass = new ReflectionClass(Son);

        expect(reflClass.hasWritableProperty('prop')).to.be.true;
        expect(reflClass.hasWritableProperty('readProp')).to.be.false;
        expect(reflClass.hasWritableProperty('writeProp')).to.be.true;
    });

    it('getParentClass should return a ReflectionClass object', () => {
        const reflClass = new ReflectionClass(Son);

        expect(reflClass.getParentClass()).to.be.instanceOf(ReflectionClass);
        expect(reflClass.getParentClass().getConstructor()).to.be.equal(Parent);
    });

    it('methods getter should work', () => {
        const reflClass = new ReflectionClass(Son);

        expect(reflClass.methods).to.be.deep.equal([ 'parentMethod', 'getFoo' ]);
    });

    it('properties getter should work', () => {
        const reflClass = new ReflectionClass(Son);

        expect(reflClass.properties).to.be.deep.equal([ 'readProp', 'writeProp', 'prop' ]);
    });

    it('constants getter should work', () => {
        const reflClass = new ReflectionClass(Son);

        expect(reflClass.constants).to.be.deep.equal({
            CONST_1: 'foobar',
            CONST_2: 'foo',
        });
    });

    it('isSubclassOf should work', () => {
        let reflClass = new ReflectionClass(Son2);

        expect(reflClass.isSubclassOf(Son2)).to.be.false;
        expect(reflClass.isSubclassOf(ISon2)).to.be.true;
        expect(reflClass.isSubclassOf(ISon)).to.be.true;
        expect(reflClass.isSubclassOf(Parent)).to.be.true;
        expect(reflClass.isSubclassOf(GrandParent)).to.be.true;

        reflClass = new ReflectionClass(Son);

        expect(reflClass.isSubclassOf(Son)).to.be.false;
        expect(reflClass.isSubclassOf(ISon2)).to.be.false;
        expect(reflClass.isSubclassOf(ISon)).to.be.true;
        expect(reflClass.isSubclassOf(Parent)).to.be.true;
        expect(reflClass.isSubclassOf(GrandParent)).to.be.true;
    });

    it('isInstanceOf should work', () => {
        let reflClass = new ReflectionClass(Son2);

        expect(reflClass.isInstanceOf(Son2)).to.be.true;
        expect(reflClass.isInstanceOf(ISon2)).to.be.true;
        expect(reflClass.isInstanceOf(ISon)).to.be.true;
        expect(reflClass.isInstanceOf(Parent)).to.be.true;
        expect(reflClass.isInstanceOf(GrandParent)).to.be.true;

        reflClass = new ReflectionClass(Son);

        expect(reflClass.isInstanceOf(Son)).to.be.true;
        expect(reflClass.isInstanceOf(ISon2)).to.be.false;
        expect(reflClass.isInstanceOf(ISon)).to.be.true;
        expect(reflClass.isInstanceOf(Parent)).to.be.true;
        expect(reflClass.isInstanceOf(GrandParent)).to.be.true;
    });

    it('isInterface should work', () => {
        let reflClass = new ReflectionClass(Son);
        expect(reflClass.isInterface).to.be.false;

        reflClass = new ReflectionClass(ISon);
        expect(reflClass.isInterface).to.be.true;
    });

    it('exposes interface methods', () => {
        const reflClass = new ReflectionClass(ISon);
        expect(reflClass.methods).to.be.deep.equal([ 'getFoo' ]);
    });
});
