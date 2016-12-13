require('../../lib/DataStructure/PriorityQueue');
const expect = require('chai').expect;

describe('PriorityQueue', function () {
    it('toStringTag', () => {
        let q = new PriorityQueue();
        expect(q.toString()).to.be.equal('[object PriorityQueue]');
    });

    it('inspect', () => {
        let q = new PriorityQueue();
        expect(q.inspect()).to.be.instanceOf(Array);
    });

    it('isEmpty', () => {
        let q = new PriorityQueue();
        expect(q.isEmpty()).to.be.true;

        q.push('foo', 1);
        expect(q.isEmpty()).to.be.false;
    });
});
