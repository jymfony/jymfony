require('../../index');
const expect = require('chai').expect;

function sleep(ms) {
    return function(done) {
        setTimeout(done, ms);
    };
}

function * doWork() {
    yield sleep(50);
    return 'foo';
}

const Async = __jymfony.Async;

describe('Async runner', function () {
    it('should return a promise', () => {
        let o = Async.run(function * () {
            yield doWork();
        });

        return expect(o).to.be.instanceOf(Promise);
    });

    it('should handle non-generator functions with return value', () => {
        let func = () => 'bar';
        return Async.run(function * () {
            let ret = yield func;
            let ret2 = yield func();

            return expect(ret).to.be.equal('bar') &&
                    expect(ret2).to.be.equal('bar');
        });
    });

    it('should handle non-generator functions with callback', () => {
        let func = cb => {
            cb(undefined, 47);
        };

        return Async.run(function * () {
            let ret = yield func;
            return expect(ret).to.be.equal(47);
        });
    });

    it('should resolve array', () => {
        let arr = [
            doWork,
            doWork(),
            Promise.resolve('bar'),
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('foobar');
                }, 1);
            }),
            () => 'baz'
        ];

        return Async.run(function * () {
            let values = yield arr;

            expect(values).to.be.deep.equal([
                'foo',
                'foo',
                'bar',
                'foobar',
                'baz'
            ]);
        });
    });

    it('should resolve object', () => {
        let arr = {
            work: doWork,
            work2: doWork(),
            bar: Promise.resolve('bar'),
            foobar: new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve('foobar');
                }, 1);
            }),
            baz: () => 'baz'
        };

        return Async.run(function * () {
            let values = yield arr;

            expect(values).to.be.deep.equal({
                work: 'foo',
                work2: 'foo',
                bar: 'bar',
                foobar: 'foobar',
                baz: 'baz'
            });
        });
    });

    it('should execute a generator function', () => {
        return Async.run(function * () {
            let a = yield doWork;
            let b = yield doWork;

            expect(a).to.be.equal('foo');
            expect(b).to.be.equal('foo');

            let res = yield [doWork, doWork];
            expect(res).to.be.deep.equal(['foo', 'foo']);
        });
    });

    it('should pass arguments', () => {
        return Async.run(function * (num, str, arr, obj, func) {
            expect(num === 47).to.be.true;
            expect(str === 'test').to.be.true;
            expect(arr).to.be.instanceOf(Array);
            expect(obj).to.be.instanceOf(Object);
            expect(func).to.be.instanceOf(Function);

            return '1';
        }, 47, 'test', ['red'], {level: 47}, () => {});
    });
});
