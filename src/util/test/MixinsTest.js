require('../lib/mixins');
const expect = require('chai').expect;

describe('Mixins.getInterface', function () {
    it('should return an extendable expression', () => {
        let iTest = getInterface(class TestInterface {});

        return expect(typeof iTest === 'function').to.be.true;
    });

    it('should check for unimplemented methods', () => {
        let iTest = getInterface(class TestInterface {
            foo() { }
        });

        let cTest = class extends implementationOf(iTest) {};
        let cTest2 = class extends implementationOf(iTest) {
            foo() { }
        };

        new cTest2();

        expect(() => new cTest).to.throw(SyntaxError, 'Method "foo" must be implemented.');
    });

    it('should check for unimplemented static methods', () => {
        let iTest = getInterface(class TestInterface {
            static foo() { }
        });

        let cTest = class extends implementationOf(iTest) {};
        let cTest2 = class extends implementationOf(iTest) {
            static foo() { }
        };
        let cTest3 = class extends implementationOf(iTest) {
            foo() { }
        };

        new cTest2();
        new cTest3();

        expect(() => new cTest).to.throw(SyntaxError, 'Method "foo" must be implemented.');
    });

    it('should check for unimplemented getters', () => {
        let iTest = getInterface(class TestInterface {
            get foo() { }
        });

        let cTest = class extends implementationOf(iTest) {};
        let cTest2 = class extends implementationOf(iTest) {
            get foo() { }
        };
        let cTest3 = class extends implementationOf(iTest) {
            set foo(foo) { }
        };

        new cTest2();

        expect(() => new cTest).to.throw(SyntaxError, 'Getter/Setter for "foo" property must be implemented.');
        expect(() => new cTest3).to.throw(SyntaxError, 'Getter for "foo" property must be implemented.');
    });

    it('should check for unimplemented static getters', () => {
        let iTest = getInterface(class TestInterface {
            static get foo() { }
        });

        let cTest = class extends implementationOf(iTest) {};
        let cTest2 = class extends implementationOf(iTest) {
            static get foo() { }
        };

        new cTest2();

        expect(() => new cTest).to.throw(SyntaxError, 'Getter for "foo" property must be implemented.');
    });

    it('should check for unimplemented setters', () => {
        let iTest = getInterface(class TestInterface {
            set foo(foo) { }
        });

        let cTest = class extends implementationOf(iTest) {};
        let cTest2 = class extends implementationOf(iTest) {
            set foo(foo) { }
        };
        let cTest3 = class extends implementationOf(iTest) {
            get foo() { }
        };

        new cTest2();

        expect(() => new cTest).to.throw(SyntaxError, 'Setter for "foo" property must be implemented.');
        expect(() => new cTest3).to.throw(SyntaxError, 'Setter for "foo" property must be implemented.');
    });

    it('should check for unimplemented static setters', () => {
        let iTest = getInterface(class TestInterface {
            static set foo(foo) { }
        });

        let cTest = class extends implementationOf(iTest) {};
        let cTest2 = class extends implementationOf(iTest) {
            static set foo(foo) { }
        };

        new cTest2();

        expect(() => new cTest).to.throw(SyntaxError, 'Setter for "foo" property must be implemented.');
    });

    it('should make instanceof work', () => {
        let iTest = getInterface(class TestInterface {});
        let iTest2 = getInterface(class Test2Interface {});

        class Foobar extends implementationOf(iTest) { }
        let o = new Foobar();

        return expect(o).to.be.instanceOf(Foobar) &&
            expect(o).to.be.instanceOf(iTest) &&
            expect(o).not.to.be.instanceOf(iTest2);
    });

    it('can be extended', () => {
        let iTest = getInterface(class TestInterface {});
        let iTest2 = getInterface(class Test2Interface extends iTest.definition {});

        class Foobar extends implementationOf(iTest2) { }
        let o = new Foobar();

        return expect(o).to.be.instanceOf(Foobar) &&
            expect(o).to.be.instanceOf(iTest) &&
            expect(o).to.be.instanceOf(iTest2);
    });
});

describe('Mixins.getTrait', function () {
    it('getTrait should return an extendable expression', () => {
        let traitTest = getTrait(class TestTrait {});

        return expect(typeof traitTest === 'function').to.be.true;
    });

    it('getTrait should not have instanceof', () => {
        let traitTest = getTrait(class TestTrait {});
        class Foobar extends mix(undefined, traitTest) { }
        let o = new Foobar();

        expect(() => o instanceof traitTest).to.throw(TypeError, 'Function has non-object prototype \'undefined\' in instanceof check');
    });

    it('traits should be extended', () => {
        let testTrait = getTrait(class TestTrait {
            foo() {
                return 'foo';
            }

            foobar() {
                return 'foobar';
            }
        });
        let testTraitEx = getTrait(class extends testTrait.definition {
            foo() {
                return 'bar';
            }

            bar() {
                return 'baz';
            }
        });

        class Foobar extends mix(undefined, testTraitEx) { }
        let o = new Foobar();

        return expect(o.foo).to.be.instanceOf(Function) &&
            expect(o.foo()).to.be.equal('bar') &&
            expect(o.bar).to.be.instanceOf(Function) &&
            expect(o.foobar).to.be.instanceOf(Function);
    });

    it('traits constructor should be called upon object creation', () => {
        let traitTest = getTrait(class TestTrait {
            __construct() {
                this.foo = 'foobar';
            }
        });
        class Foobar extends mix(undefined, traitTest) {
            __construct() {}
        }

        let obj = new Foobar();
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
