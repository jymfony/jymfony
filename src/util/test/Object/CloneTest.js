const TestCase = Jymfony.Component.Testing.Framework.TestCase;

class GrandParent {
    get readProp() { }
    set writeProp(v) { }
}
class Parent extends GrandParent {
    parentMethod() { }
}
const ISon = getInterface(class SonInterface {});

class Son extends mix(Parent, ISon) {
    constructor() {
        super();
        this.foo = 'bar';
        this.cloned = false;
    }

    __clone() {
        this.cloned = true;
    }
}

export default class CloneTest extends TestCase {
    testCloneShouldWork() {
        const son1 = new Son();
        const son2 = __jymfony.clone(son1);

        __self.assertInstanceOf(Son, son2);
        __self.assertInstanceOf(ISon, son2);
        __self.assertInstanceOf(Parent, son2);
        __self.assertInstanceOf(GrandParent, son2);

        __self.assertEquals('bar', son2.foo);
        son2.foo = 'foobar';
        __self.assertTrue(son2.cloned);

        __self.assertEquals('bar', son1.foo);
        __self.assertFalse(son1.cloned);
    }
}
