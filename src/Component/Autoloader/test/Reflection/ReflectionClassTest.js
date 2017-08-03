let expect = require('chai').expect;

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
let ISon = getInterface(class SonInterface {});
let ISon2 = getInterface(class Son2Interface {});

class Son extends mix(Parent, ISon) {
    constructor() { super(); this.foo = 'bar'; }

    get prop() { }
    set prop(v) { }
}

class Son2 extends mix(Parent, ISon, ISon2) {
    constructor() { super(); this.foo = 'bar'; }

    get prop() { }
    set prop(v) { }
}

Parent.CONST_1 = 'foobar';
Son.CONST_2 = 'foo';

describe('[Autoloader] ReflectionClass', function () {
    it('newInstance should return an object', () => {
        let reflClass = new ReflectionClass(Son);
        let obj = reflClass.newInstance();

        expect(obj).not.to.be.undefined;
        expect(obj).to.be.instanceOf(Son);
        expect(obj.foo).to.be.equal('bar');
    });

    it('newInstanceWithoutConstructor should return an object', () => {
        let reflClass = new ReflectionClass(Son);
        let obj = reflClass.newInstanceWithoutConstructor();

        expect(obj).not.to.be.undefined;
        expect(obj).to.be.instanceOf(Son);
        expect(obj.foo).to.be.undefined;
    });

    it('newInstanceWithoutConstructor should not break instanceof chain', () => {
        let reflClass = new ReflectionClass(Son);
        let obj = reflClass.newInstanceWithoutConstructor();

        expect(obj).to.be.instanceOf(Son);
        expect(obj).to.be.instanceOf(Parent);
        expect(obj).to.be.instanceOf(GrandParent);
        expect(obj).to.be.instanceOf(ISon);
    });

    it('hasMethod should work', () => {
        let reflClass = new ReflectionClass(Son);

        expect(reflClass.hasMethod('parentMethod')).to.be.true;
    });

    it('hasProperty should work', () => {
        let reflClass = new ReflectionClass(Son);

        expect(reflClass.hasProperty('prop')).to.be.true;
        expect(reflClass.hasProperty('readProp')).to.be.true;
        expect(reflClass.hasProperty('writeProp')).to.be.true;
    });

    it('hasReadableProperty should work', () => {
        let reflClass = new ReflectionClass(Son);

        expect(reflClass.hasReadableProperty('prop')).to.be.true;
        expect(reflClass.hasReadableProperty('readProp')).to.be.true;
        expect(reflClass.hasReadableProperty('writeProp')).to.be.false;
    });

    it('hasWritableProperty should work', () => {
        let reflClass = new ReflectionClass(Son);

        expect(reflClass.hasWritableProperty('prop')).to.be.true;
        expect(reflClass.hasWritableProperty('readProp')).to.be.false;
        expect(reflClass.hasWritableProperty('writeProp')).to.be.true;
    });

    it('getParentClass should return a ReflectionClass object', () => {
        let reflClass = new ReflectionClass(Son);

        expect(reflClass.getParentClass()).to.be.instanceOf(ReflectionClass);
        expect(reflClass.getParentClass().getConstructor()).to.be.equal(Parent);
    });

    it('methods getter should work', () => {
        let reflClass = new ReflectionClass(Son);

        expect(reflClass.methods).to.be.deep.equal(['parentMethod']);
    });

    it('properties getter should work', () => {
        let reflClass = new ReflectionClass(Son);

        expect(reflClass.properties).to.be.deep.equal(['readProp', 'writeProp', 'prop']);
    });

    it('constants getter should work', () => {
        let reflClass = new ReflectionClass(Son);

        expect(reflClass.constants).to.be.deep.equal({
            CONST_1: 'foobar',
            CONST_2: 'foo',
        });
    });

    it('isSubclassOf should work', () => {
        let reflClass = new ReflectionClass(Son2);

        expect(reflClass.isSubclassOf(ISon2)).to.be.true;
        expect(reflClass.isSubclassOf(ISon)).to.be.true;
        expect(reflClass.isSubclassOf(Parent)).to.be.true;
        expect(reflClass.isSubclassOf(GrandParent)).to.be.true;

        reflClass = new ReflectionClass(Son);

        expect(reflClass.isSubclassOf(ISon2)).to.be.false;
        expect(reflClass.isSubclassOf(ISon)).to.be.true;
        expect(reflClass.isSubclassOf(Parent)).to.be.true;
        expect(reflClass.isSubclassOf(GrandParent)).to.be.true;
    })
});
