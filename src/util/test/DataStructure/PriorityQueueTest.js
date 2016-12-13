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

    it('clear', () => {
        let q = new PriorityQueue();
        expect(q.length).to.be.equal(0);

        q.push('foo', 1);
        q.push('bar', 1);
        expect(q.length).to.be.equal(2);

        q.clear();
        expect(q.length).to.be.equal(0);
    });

    it('copy', () => {
        let q = new PriorityQueue();
        q.push('foo', 1);
        q.push('bar', 0);

        let copy = q.copy();
        expect(copy.toArray()).to.be.deep.equal(['foo', 'bar']);
    });

    it('length', () => {
        let q = new PriorityQueue();
        expect(q.length).to.be.equal(0);

        q.push('foo', 1);
        expect(q.length).to.be.equal(1);

        q.push('bar', 0);
        expect(q.length).to.be.equal(2);

        q.pop();
        expect(q.length).to.be.equal(1);
    });

    it('peek throws UnderflowException if queue is empty', () => {
        let q = new PriorityQueue();
        try {
            q.peek();
        } catch (e) {
            expect(e).to.be.instanceOf(UnderflowException);
            return;
        }

        throw new Error('Error expected');
    });

    it('peek', () => {
        let q = new PriorityQueue();
        q.push('foo', 0);
        q.push('bar', 1);

        let first = q.peek();
        expect(first).to.be.equal('bar');
        expect(q.length).to.be.equal(2);
    });

    it('pop throws UnderflowException if queue is empty', () => {
        let q = new PriorityQueue();
        try {
            q.pop();
        } catch (e) {
            expect(e).to.be.instanceOf(UnderflowException);
            return;
        }

        throw new Error('Error expected');
    });

    it('pop', () => {
        let q = new PriorityQueue();
        q.push('foo', 0);
        q.push('bar', 1);

        let first = q.pop();
        expect(first).to.be.equal('bar');
        expect(q.length).to.be.equal(1);
    });

    it('pops element in correct order', () => {
        let q = new PriorityQueue();
        q.push('foo', 1);
        q.push('bar', 12);
        q.push('baz', 1);
        q.push('foobar', 3);

        expect(q.pop()).to.be.equal('bar');
        expect(q.pop()).to.be.equal('foobar');
        expect(q.pop()).to.be.equal('foo');
        expect(q.pop()).to.be.equal('baz');
        expect(q.length).to.be.equal(0);
    });

    it('push', () => {
        let q = new PriorityQueue();
        q.push('foo', 0);
        q.push('bar', 1);

        expect(q.length).to.be.equal(2);
    });

    it('toArray', () => {
        let q = new PriorityQueue();
        q.push('foo', 1);
        q.push('bar', 12);
        q.push('baz', 1);
        q.push('foobar', 3);

        expect(q.toArray()).to.be.deep.equal(['bar', 'foobar', 'foo', 'baz']);
        expect(q.length).to.be.equal(4);
    });

    it('iterator pops elements out', () => {
        let q = new PriorityQueue();
        q.push('foo', 1);
        q.push('bar', 12);
        q.push('baz', 1);
        q.push('foobar', 3);

        let count = 4;
        for (let el of q) {
            expect(q.length).to.be.equal(--count);
        }
    })
});
