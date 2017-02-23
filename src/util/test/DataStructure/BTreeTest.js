require('../../lib/DataStructure/PriorityQueue');
const expect = require('chai').expect;

let fillWithData = t => {
    t.push("www.example.org",      "93.184.216.34");
    t.push("www.twitter.com",      "104.244.42.65");
    t.push("www.facebook.com",     "31.13.92.36");
    t.push("www.simpsons.com",     "209.052.165.60");
    t.push("www.apple.com",        "17.112.152.32");
    t.push("www.amazon.com",       "207.171.182.16");
    t.push("www.ebay.com",         "66.135.192.87");
    t.push("www.cnn.com",          "64.236.16.20");
    t.push("www.google.com",       "216.239.41.99");
    t.push("www.nytimes.com",      "199.239.136.200");
    t.push("www.microsoft.com",    "207.126.99.140");
    t.push("www.ubuntu.org",       "82.98.134.233");
    t.push("www.sony.com",         "23.33.68.135");
    t.push("www.playstation.com",  "23.32.11.42");
    t.push("www.dell.com",         "143.166.224.230");
    t.push("www.slashdot.org",     "66.35.250.151");
    t.push("www.github.com",       "192.30.253.112");
    t.push("www.gitlab.com",       "104.210.2.228");
    t.push("www.bitbucket.com",    "104.192.143.7");
    t.push("www.espn.com",         "199.181.135.201");
    t.push("www.weather.com",      "63.111.66.11");
    t.push("www.yahoo.com",        "216.109.118.65");
};

describe('BTree', function () {
    it('toStringTag', () => {
        let t = new BTree();
        expect(t.toString()).to.be.equal('[object BTree]');
    });

    it('inspect', () => {
        let t = new BTree();
        expect(t.inspect()).to.be.instanceOf(Array);
    });

    it('push throws if key is null', () => {
        let t = new BTree();
        try {
            t.push(null, 'foo');
        } catch (e) {
            expect(e).to.be.instanceOf(InvalidArgumentException);
            return;
        }

        throw new Error('Expected exception');
    });

    it('push throws if key is undefined', () => {
        let t = new BTree();
        try {
            t.push(undefined, 'foo');
        } catch (e) {
            expect(e).to.be.instanceOf(InvalidArgumentException);
            return;
        }

        throw new Error('Expected exception');
    });

    it('isEmpty', () => {
        let t = new BTree();
        expect(t.isEmpty()).to.be.true;

        t.push('foo', 1);
        expect(t.isEmpty()).to.be.false;
    });

    it('clear', () => {
        let t = new BTree();
        expect(t.length).to.be.equal(0);

        t.push('foo', 1);
        t.push('bar', 1);
        expect(t.length).to.be.equal(2);

        t.clear();
        expect(t.length).to.be.equal(0);
    });

    it('copy', () => {
        let t = new BTree();
        fillWithData(t);

        let copy = t.copy();
        expect(copy.length).to.be.equal(22);
        expect(copy.height).to.be.equal(3);
        expect(copy.toArray()).to.be.deep.equal([
            [ 'www.amazon.com', '207.171.182.16' ],
            [ 'www.apple.com', '17.112.152.32' ],
            [ 'www.bitbucket.com', '104.192.143.7' ],
            [ 'www.cnn.com', '64.236.16.20' ],
            [ 'www.dell.com', '143.166.224.230' ],
            [ 'www.ebay.com', '66.135.192.87' ],
            [ 'www.espn.com', '199.181.135.201' ],
            [ 'www.example.org', '93.184.216.34' ],
            [ 'www.facebook.com', '31.13.92.36' ],
            [ 'www.github.com', '192.30.253.112' ],
            [ 'www.gitlab.com', '104.210.2.228' ],
            [ 'www.google.com', '216.239.41.99' ],
            [ 'www.microsoft.com', '207.126.99.140' ],
            [ 'www.nytimes.com', '199.239.136.200' ],
            [ 'www.playstation.com', '23.32.11.42' ],
            [ 'www.simpsons.com', '209.052.165.60' ],
            [ 'www.slashdot.org', '66.35.250.151' ],
            [ 'www.sony.com', '23.33.68.135' ],
            [ 'www.twitter.com', '104.244.42.65' ],
            [ 'www.ubuntu.org', '82.98.134.233' ],
            [ 'www.weather.com', '63.111.66.11' ],
            [ 'www.yahoo.com', '216.109.118.65' ]
        ]);

        copy.remove('www.example.org');
        copy.remove('www.ebay.com');
        copy.push('www.yahoo.com', 'garbage');

        expect(copy.length).to.be.equal(20);
        expect(copy.get('www.yahoo.com')).to.be.equal('garbage');

        expect(t.length).to.be.equal(22);
        expect(t.get('www.yahoo.com')).to.be.equal('216.109.118.65');
    });

    it('search with equal key', () => {
        let t = new BTree();
        fillWithData(t);

        expect(t.search('www.github.com')).to.be.deep.equal(['www.github.com', '192.30.253.112']);
    });

    it('search with nearest lesser key', () => {
        let t = new BTree();
        fillWithData(t);

        expect(t.search('www.github', BTree.COMPARISON_LESSER)).to.be.deep.equal(['www.facebook.com', '31.13.92.36']);
    });

    it('search with nearest greater key', () => {
        let t = new BTree();
        fillWithData(t);

        expect(t.search('www.github', BTree.COMPARISON_GREATER)).to.be.deep.equal(['www.github.com', '192.30.253.112']);
    });

    it('length', () => {
        let t = new BTree();
        expect(t.length).to.be.equal(0);

        t.push('foo', 1);
        expect(t.length).to.be.equal(1);

        t.push('bar', 0);
        expect(t.length).to.be.equal(2);

        t.remove('foo');
        expect(t.length).to.be.equal(1);
    });

    it('height', () => {
        let t = new BTree();
        fillWithData(t);

        expect(t.height).to.be.equal(3);
    });

    it('toArray', () => {
        let t = new BTree();
        t.push('foo', 1);
        t.push('bar', 12);
        t.push('baz', 1);
        t.push('foobar', 3);

        expect(t.toArray()).to.be.deep.equal([
            ['bar', 12],
            ['baz', 1],
            ['foo', 1],
            ['foobar', 3]
        ]);
        expect(t.length).to.be.equal(4);
    });
});
