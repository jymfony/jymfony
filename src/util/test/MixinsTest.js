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

        expect(() => new cTest).to.throw(SyntaxError, 'Method "foo" must be implemented');
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
        class Foobar extends mix(undefined, traitTest) { }

        let obj = new Foobar();
        expect(obj.foo).to.be.equal('foobar');
    });
});
