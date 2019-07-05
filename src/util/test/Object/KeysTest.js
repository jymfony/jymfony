require('../../lib/Object/clone');
const expect = require('chai').expect;
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

describe('Keys', function () {
    it('keys should work', () => {
        const son1 = new Son();
        const son2 = __jymfony.clone(son1);

        expect(__jymfony.keys(son1)).to.be.deep.equal([ 'foo', 'foobar', sym ]);
        expect(__jymfony.keys(son2)).to.be.deep.equal([ 'foo', 'foobar', sym ]);
    });
});
