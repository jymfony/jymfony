require('../lib/mixins');
const expect = require('chai').expect;

describe('Mixins.getInterface', function () {
    it('should return an extendable expression', () => {
        const iTest = getInterface(class TestInterface {});

        return expect('function' === typeof iTest).to.be.true;
    });

    it('should check for unimplemented methods', () => {
        const iTest = getInterface(class TestInterface {
            foo() { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            foo() { }
        };

        new cTest2();

        expect(() => new cTest()).to.throw(SyntaxError, 'Method "foo" must be implemented.');
    });

    it('should check for unimplemented static methods', () => {
        const iTest = getInterface(class TestInterface {
            static foo() { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            static foo() { }
        };
        const cTest3 = class extends implementationOf(iTest) {
            foo() { }
        };

        new cTest2();
        new cTest3();

        expect(() => new cTest()).to.throw(SyntaxError, 'Method "foo" must be implemented.');
    });

    it('should check for unimplemented getters', () => {
        const iTest = getInterface(class TestInterface {
            get foo() { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            get foo() { }
        };
        const cTest3 = class extends implementationOf(iTest) {
            set foo(foo) { }
        };

        new cTest2();

        expect(() => new cTest()).to.throw(SyntaxError, 'Getter/Setter for "foo" property must be implemented.');
        expect(() => new cTest3()).to.throw(SyntaxError, 'Getter for "foo" property must be implemented.');
    });

    it('should check for unimplemented static getters', () => {
        const iTest = getInterface(class TestInterface {
            static get foo() { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            static get foo() { }
        };

        new cTest2();

        expect(() => new cTest()).to.throw(SyntaxError, 'Getter for "foo" property must be implemented.');
    });

    it('should check for unimplemented setters', () => {
        const iTest = getInterface(class TestInterface {
            set foo(foo) { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            set foo(foo) { }
        };
        const cTest3 = class extends implementationOf(iTest) {
            get foo() { }
        };

        new cTest2();

        expect(() => new cTest()).to.throw(SyntaxError, 'Setter for "foo" property must be implemented.');
        expect(() => new cTest3()).to.throw(SyntaxError, 'Setter for "foo" property must be implemented.');
    });

    it('should check for unimplemented static setters', () => {
        const iTest = getInterface(class TestInterface {
            static set foo(foo) { }
        });

        const cTest = class extends implementationOf(iTest) {};
        const cTest2 = class extends implementationOf(iTest) {
            static set foo(foo) { }
        };

        new cTest2();

        expect(() => new cTest()).to.throw(SyntaxError, 'Setter for "foo" property must be implemented.');
    });

    it('should make instanceof work', () => {
        const iTest = getInterface(class TestInterface {});
        const iTest2 = getInterface(class Test2Interface {});

        class Foobar extends implementationOf(iTest) { }
        const o = new Foobar();

        return expect(o).to.be.instanceOf(Foobar) &&
            expect(o).to.be.instanceOf(iTest) &&
            expect(o).not.to.be.instanceOf(iTest2);
    });

    it('can be extended', () => {
        const iTest = getInterface(class TestInterface {});
        const iTest2 = getInterface(class Test2Interface extends iTest.definition {});

        class Foobar extends implementationOf(iTest2) { }
        const o = new Foobar();

        return expect(o).to.be.instanceOf(Foobar) &&
            expect(o).to.be.instanceOf(iTest) &&
            expect(o).to.be.instanceOf(iTest2);
    });

    it('should inherit interfaces from parent classes', () => {
        const iTest = getInterface(class TestInterface {});
        const iTest2 = getInterface(class Test2Interface {});

        class Foo extends implementationOf(iTest) {}
        class FooBar extends mix(Foo, iTest2) {}

        const o = new FooBar();
        expect(o).to.be.instanceOf(FooBar);
        expect(o).to.be.instanceOf(iTest2);
        expect(o).to.be.instanceOf(iTest);
    });
});

describe('Mixins.getTrait', function () {
    it('getTrait should return an extendable expression', () => {
        const traitTest = getTrait(class TestTrait {});

        return expect('function' === typeof traitTest).to.be.true;
    });

    it('getTrait should not have instanceof', () => {
        const traitTest = getTrait(class TestTrait {});
        class Foobar extends mix(undefined, traitTest) { }
        const o = new Foobar();

        expect(() => o instanceof traitTest).to.throw(TypeError, 'Function has non-object prototype \'undefined\' in instanceof check');
    });

    it('traits should be extended', () => {
        const testTrait = getTrait(class TestTrait {
            foo() {
                return 'foo';
            }

            foobar() {
                return 'foobar';
            }
        });
        const testTraitEx = getTrait(class extends testTrait.definition {
            foo() {
                return 'bar';
            }

            bar() {
                return 'baz';
            }
        });

        class Foobar extends mix(undefined, testTraitEx) { }
        const o = new Foobar();

        return expect(o.foo).to.be.instanceOf(Function) &&
            expect(o.foo()).to.be.equal('bar') &&
            expect(o.bar).to.be.instanceOf(Function) &&
            expect(o.foobar).to.be.instanceOf(Function);
    });

    it('traits constructor should be called upon object creation', () => {
        const traitTest = getTrait(class TestTrait {
            __construct() {
                this.foo = 'foobar';
            }
        });
        class Foobar extends mix(undefined, traitTest) {
            __construct() {}
        }

        const obj = new Foobar();
        expect(obj.foo).to.be.equal('foobar');
    });

    it('constants should be inherited from trait', () => {
        const traitClass = class TestTrait { };
        traitClass.STATIC_VALUE = 'static';

        const traitTest = getTrait(traitClass);
        class Foobar extends mix(undefined, traitTest) { }

        expect(Foobar.STATIC_VALUE).to.be.equal('static');
    });
});
