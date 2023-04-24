const TestCase = Jymfony.Component.Testing.Framework.TestCase;
const sym = Symbol('test');

class GrandParent {
    constructor() {
        this.foo = 'bar';
        this[sym] = 'barbar';
    }
}
class Parent extends GrandParent {
    parentMethod() { }
}
const ISon = getInterface(class SonInterface {});

class Son extends mix(Parent, ISon) {
    constructor() {
        super();
        this.foobar = 'bar';
    }
}

export default class KeysTest extends TestCase {
    testKeysShouldWork() {
        const son1 = new Son();
        const son2 = __jymfony.clone(son1);

        __self.assertEquals([ 'foo', 'foobar', sym ], __jymfony.keys(son1));
        __self.assertEquals([ 'foo', 'foobar', sym ], __jymfony.keys(son2));
    }
}
