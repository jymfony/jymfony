require('../lib/mixins');
const expect = require('chai').expect;

describe('Mixins.getInterface', function () {
    it('should return an extendable expression', () => {
        let iTest = getInterface(class TestInterface {});

        return expect(typeof iTest === 'function').to.be.true;
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