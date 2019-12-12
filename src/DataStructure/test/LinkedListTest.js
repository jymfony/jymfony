require('../src/LinkedList');
const { expect } = require('chai');

describe('LinkedList', function () {
    it('toStringTag', () => {
        const q = new LinkedList();
        expect(q.toString()).to.be.equal('[object LinkedList]');
    });

    it('inspect', () => {
        const q = new LinkedList();
        expect(q.inspect()).to.be.instanceOf(Array);
    });

    it('isEmpty', () => {
        const q = new LinkedList();
        expect(q.isEmpty()).to.be.true;

        q.push('foo');
        expect(q.isEmpty()).to.be.false;
    });

    it('clear', () => {
        const q = new LinkedList();
        expect(q.length).to.be.equal(0);

        q.push('foo');
        q.push('bar');
        expect(q.length).to.be.equal(2);

        q.clear();
        expect(q.length).to.be.equal(0);
    });

    it('copy', () => {
        const q = new LinkedList();
        q.push('foo');
        q.push('bar');

        const copy = q.copy();
        expect(copy.toArray()).to.be.deep.equal([ 'foo', 'bar' ]);
    });

    it('length', () => {
        const q = new LinkedList();
        expect(q.length).to.be.equal(0);

        q.push('foo');
        expect(q.length).to.be.equal(1);

        q.push('bar');
        expect(q.length).to.be.equal(2);

        q.pop();
        expect(q.length).to.be.equal(1);
    });

    it('first', () => {
        const q = new LinkedList();
        q.push('foo');
        q.push('bar');

        expect(q.first).to.be.equal('foo');
    });

    it('first returns undefined if list is empty', () => {
        const q = new LinkedList();
        expect(q.first).to.be.undefined;
    });

    it('last', () => {
        const q = new LinkedList();
        q.push('foo');
        q.push('bar');

        expect(q.last).to.be.equal('bar');
    });

    it('last returns undefined if list is empty', () => {
        const q = new LinkedList();
        expect(q.last).to.be.undefined;
    });

    it('pop returns undefined if list is empty', () => {
        const q = new LinkedList();
        expect(q.pop()).to.be.undefined;
    });

    it('pop', () => {
        const q = new LinkedList();
        q.push('foo');
        q.push('bar');

        const first = q.pop();
        expect(first).to.be.equal('bar');
        expect(q.length).to.be.equal(1);
    });

    it('pops element in correct order', () => {
        const q = new LinkedList();
        q.push('foo');
        q.push('bar');
        q.push('baz');
        q.push('foobar');

        expect(q.pop()).to.be.equal('foobar');
        expect(q.pop()).to.be.equal('baz');
        expect(q.pop()).to.be.equal('bar');
        expect(q.pop()).to.be.equal('foo');
        expect(q.length).to.be.equal(0);
    });

    it('push', () => {
        const q = new LinkedList();
        q.push('foo');
        q.push('bar');

        expect(q.length).to.be.equal(2);
    });

    it('shift returns undefined if list is empty', () => {
        const q = new LinkedList();
        expect(q.shift()).to.be.undefined;
    });

    it('shift', () => {
        const q = new LinkedList();
        q.unshift('foo');
        q.unshift('bar');

        const first = q.shift();
        expect(first).to.be.equal('bar');
        expect(q.length).to.be.equal(1);
    });

    it('shifts element in correct order', () => {
        const q = new LinkedList();
        q.unshift('foo');
        q.unshift('bar');
        q.unshift('baz');
        q.unshift('foobar');

        expect(q.shift()).to.be.equal('foobar');
        expect(q.shift()).to.be.equal('baz');
        expect(q.shift()).to.be.equal('bar');
        expect(q.shift()).to.be.equal('foo');
        expect(q.length).to.be.equal(0);
    });

    it('unshift', () => {
        const q = new LinkedList();
        q.unshift('foo');
        q.unshift('bar');

        expect(q.length).to.be.equal(2);
    });

    it('toArray', () => {
        const q = new LinkedList();
        q.push('foo');
        q.push('bar');
        q.push('baz');
        q.push('foobar');

        expect(q.toArray()).to.be.deep.equal([ 'foo', 'bar', 'baz', 'foobar' ]);
        expect(q.length).to.be.equal(4);
    });

    it('iterator yields elements', () => {
        const q = new LinkedList();
        q.push('foo');
        q.push('bar');
        q.push('baz');
        q.push('foobar');

        for (const el of q) {
            expect(el).not.to.be.undefined;
        }
    });
});
