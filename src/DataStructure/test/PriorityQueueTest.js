require('../src/PriorityQueue');
const { expect } = require('chai');

describe('PriorityQueue', function () {
    it('toStringTag', () => {
        const q = new PriorityQueue();
        expect(q.toString()).to.be.equal('[object PriorityQueue]');
    });

    it('inspect', () => {
        const q = new PriorityQueue();
        expect(q.inspect()).to.be.instanceOf(Array);
    });

    it('isEmpty', () => {
        const q = new PriorityQueue();
        expect(q.isEmpty()).to.be.true;

        q.push('foo', 1);
        expect(q.isEmpty()).to.be.false;
    });

    it('clear', () => {
        const q = new PriorityQueue();
        expect(q.length).to.be.equal(0);

        q.push('foo', 1);
        q.push('bar', 1);
        expect(q.length).to.be.equal(2);

        q.clear();
        expect(q.length).to.be.equal(0);
    });

    it('copy', () => {
        const q = new PriorityQueue();
        q.push('foo', 1);
        q.push('bar', 0);

        const copy = q.copy();
        expect(copy.toArray()).to.be.deep.equal([ [ 1, 'foo' ], [ 0, 'bar' ] ]);
    });

    it('length', () => {
        const q = new PriorityQueue();
        expect(q.length).to.be.equal(0);

        q.push('foo', 1);
        expect(q.length).to.be.equal(1);

        q.push('bar', 0);
        expect(q.length).to.be.equal(2);

        q.pop();
        expect(q.length).to.be.equal(1);
    });

    it('peek throws UnderflowException if queue is empty', () => {
        const q = new PriorityQueue();
        expect(q.peek.bind(q)).to.throw(UnderflowException);
    });

    it('peek', () => {
        const q = new PriorityQueue();
        q.push('foo', 0);
        q.push('bar', 1);

        const first = q.peek();
        expect(first).to.be.equal('bar');
        expect(q.length).to.be.equal(2);
    });

    it('pop throws UnderflowException if queue is empty', () => {
        const q = new PriorityQueue();
        expect(q.pop.bind(q)).to.throw(UnderflowException);
    });

    it('pop', () => {
        const q = new PriorityQueue();
        q.push('foo', 0);
        q.push('bar', 1);

        const first = q.pop();
        expect(first).to.be.equal('bar');
        expect(q.length).to.be.equal(1);
    });

    it('pops element in correct order', () => {
        const q = new PriorityQueue();
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
        const q = new PriorityQueue();
        q.push('foo', 0);
        q.push('bar', 1);

        expect(q.length).to.be.equal(2);
    });

    it('toArray', () => {
        const q = new PriorityQueue();
        q.push('foo', 1);
        q.push('bar', 12);
        q.push('baz', 1);
        q.push('foobar', 3);

        expect(q.toArray()).to.be.deep.equal([ [ 12, 'bar' ], [ 3, 'foobar' ], [ 1, 'foo' ], [ 1, 'baz' ] ]);
        expect(q.length).to.be.equal(4);
    });

    it('iterator pops elements out', () => {
        const q = new PriorityQueue();
        q.push('foo', 1);
        q.push('bar', 12);
        q.push('baz', 1);
        q.push('foobar', 3);

        let count = 4;
        for (const el of q) {
            expect(el).not.to.be.undefined;
            expect(q.length).to.be.equal(--count);
        }
    });
});
