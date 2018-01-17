require('../../lib/Object/clone');
const expect = require('chai').expect;

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
        super(); this.foo = 'bar';
    }
}

describe('Clone', function () {
    it('clone should work', () => {
        const son1 = new Son();
        const son2 = __jymfony.clone(son1);

        expect(son2).to.be.instanceOf(Son);
        expect(son2).to.be.instanceOf(ISon);
        expect(son2).to.be.instanceOf(Parent);
        expect(son2).to.be.instanceOf(GrandParent);

        expect(son2.foo).to.be.equal('bar');
        son2.foo = 'foobar';

        expect(son1.foo).to.be.equal('bar');
    });
});
