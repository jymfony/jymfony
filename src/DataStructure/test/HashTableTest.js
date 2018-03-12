require('../src/HashTable');
const expect = require('chai').expect;

const fillWithData = t => {
    t.put('www.example.org', '93.184.216.34');
    t.put('www.twitter.com', '104.244.42.65');
    t.put('www.facebook.com', '31.13.92.36');
    t.put('www.simpsons.com', '209.052.165.60');
    t.put('www.apple.com', '17.112.152.32');
    t.put('www.amazon.com', '207.171.182.16');
    t.put('www.ebay.com', '66.135.192.87');
    t.put('www.cnn.com', '64.236.16.20');
    t.put('www.google.com', '216.239.41.99');
    t.put('www.nytimes.com', '199.239.136.200');
    t.put('www.microsoft.com', '207.126.99.140');
    t.put('www.ubuntu.org', '82.98.134.233');
    t.put('www.sony.com', '23.33.68.135');
    t.put('www.playstation.com', '23.32.11.42');
    t.put('www.dell.com', '143.166.224.230');
    t.put('www.slashdot.org', '66.35.250.151');
    t.put('www.github.com', '192.30.253.112');
    t.put('www.gitlab.com', '104.210.2.228');
    t.put('www.bitbucket.com', '104.192.143.7');
    t.put('www.espn.com', '199.181.135.201');
    t.put('www.weather.com', '63.111.66.11');
    t.put('www.yahoo.com', '216.109.118.65');
};

describe('HashTable', function () {
    it('toStringTag', () => {
        const t = new HashTable();
        expect(t.toString()).to.be.equal('[object HashTable]');
    });

    it('inspect', () => {
        const t = new HashTable();
        expect(t.inspect()).to.be.instanceOf(Array);
    });

    it('push throws if key is null', () => {
        const t = new HashTable();
        expect(t.put.bind(t, null, 'foo')).to.throw(InvalidArgumentException);
    });

    it('push throws if key is undefined', () => {
        const t = new HashTable();
        expect(t.put.bind(t, undefined, 'foo')).to.throw(InvalidArgumentException);
    });

    it('isEmpty', () => {
        const t = new HashTable();
        expect(t.isEmpty()).to.be.true;

        t.put('foo', 2);
        expect(t.isEmpty()).to.be.false;
    });

    it('clear', () => {
        const t = new HashTable();
        expect(t.length).to.be.equal(0);

        t.push('foo', 1);
        t.push('bar', 1);
        expect(t.length).to.be.equal(2);

        t.clear();
        expect(t.length).to.be.equal(0);
    });

    it('copy', () => {
        const t = new HashTable();
        fillWithData(t);

        const copy = t.copy();
        expect(copy.length).to.be.equal(22);
        expect(copy.toArray()).to.be.deep.equal([
            [ 'www.example.org', '93.184.216.34' ],
            [ 'www.twitter.com', '104.244.42.65' ],
            [ 'www.facebook.com', '31.13.92.36' ],
            [ 'www.simpsons.com', '209.052.165.60' ],
            [ 'www.apple.com', '17.112.152.32' ],
            [ 'www.amazon.com', '207.171.182.16' ],
            [ 'www.ebay.com', '66.135.192.87' ],
            [ 'www.cnn.com', '64.236.16.20' ],
            [ 'www.google.com', '216.239.41.99' ],
            [ 'www.nytimes.com', '199.239.136.200' ],
            [ 'www.microsoft.com', '207.126.99.140' ],
            [ 'www.ubuntu.org', '82.98.134.233' ],
            [ 'www.sony.com', '23.33.68.135' ],
            [ 'www.playstation.com', '23.32.11.42' ],
            [ 'www.dell.com', '143.166.224.230' ],
            [ 'www.slashdot.org', '66.35.250.151' ],
            [ 'www.github.com', '192.30.253.112' ],
            [ 'www.gitlab.com', '104.210.2.228' ],
            [ 'www.bitbucket.com', '104.192.143.7' ],
            [ 'www.espn.com', '199.181.135.201' ],
            [ 'www.weather.com', '63.111.66.11' ],
            [ 'www.yahoo.com', '216.109.118.65' ],
        ]);

        copy.remove('www.example.org');
        copy.remove('www.ebay.com');
        copy.put('www.yahoo.com', 'garbage');

        expect(copy.length).to.be.equal(20);
        expect(copy.get('www.yahoo.com')).to.be.equal('garbage');

        expect(t.length).to.be.equal(22);
        expect(t.get('www.yahoo.com')).to.be.equal('216.109.118.65');
    });

    it('get with equal key', () => {
        const t = new HashTable();
        fillWithData(t);

        expect(t.get('www.github.com')).to.be.equal('192.30.253.112');
    });

    it('get with nonexistent key', () => {
        const t = new HashTable();
        fillWithData(t);

        expect(t.get('www.foobar.com')).to.be.undefined;
    });

    it('length', () => {
        const t = new HashTable();
        expect(t.length).to.be.equal(0);

        t.put('foo', 1);
        expect(t.length).to.be.equal(1);

        t.put('bar', 0);
        expect(t.length).to.be.equal(2);

        t.remove('foo');
        expect(t.length).to.be.equal(1);
    });

    it('first', () => {
        const t = new HashTable();
        fillWithData(t);

        expect(t.first).to.be.equal('93.184.216.34');
    });

    it('last', () => {
        const t = new HashTable();
        fillWithData(t);

        expect(t.last).to.be.equal('216.109.118.65');
    });

    it('push sets numeric indices', () => {
        const t = new HashTable();

        t.push('foobar');
        t.push('barbar');

        expect(t.toArray()).to.be.deep.equal([ [ '0', 'foobar' ], [ '1', 'barbar' ] ]);
    });

    it('pop removes last element', () => {
        const t = new HashTable();

        t.push('foobar');
        t.push('barbar');

        expect(t.toArray()).to.be.deep.equal([ [ '0', 'foobar' ], [ '1', 'barbar' ] ]);
        expect(t.pop()).to.be.equal('barbar');
        expect(t.toArray()).to.be.deep.equal([ [ '0', 'foobar' ] ]);
        expect(t.last).to.be.equal('foobar');
    });

    it('toArray', () => {
        const t = new HashTable();
        t.put('foo', 1);
        t.put('bar', 12);
        t.put('baz', 1);
        t.put('foobar', 3);

        expect(t.toArray()).to.be.deep.equal([
            [ 'foo', 1 ],
            [ 'bar', 12 ],
            [ 'baz', 1 ],
            [ 'foobar', 3 ],
        ]);
        expect(t.length).to.be.equal(4);
    });
});
