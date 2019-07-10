require('../../index');
const { expect } = require('chai');

function * doWork() {
    yield __jymfony.sleep(50);
    return 'foo';
}

const Async = __jymfony.Async;

describe('Async runner', function () {
    it('run should return a promise', () => {
        const o = Async.run(function * () {
            yield doWork();
        });

        return expect(o).to.be.instanceOf(Promise);
    });

    it('run should handle non-generator functions with return value', () => {
        const func = () => 'bar';
        return Async.run(function * () {
            const ret = yield func;
            const ret2 = yield func();

            return expect(ret).to.be.equal('bar') &&
                    expect(ret2).to.be.equal('bar');
        });
    });

    it('run should handle non-generator functions with callback', () => {
        const func = cb => {
            cb(undefined, 47);
        };

        return Async.run(function * () {
            const ret = yield func;
            return expect(ret).to.be.equal(47);
        });
    });

    it('run should resolve array', () => {
        const arr = [
            doWork,
            doWork(),
            Promise.resolve('bar'),
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve('foobar');
                }, 1);
            }),
            () => 'baz',
        ];

        return Async.run(function * () {
            const values = yield arr;

            expect(values).to.be.deep.equal([
                'foo',
                'foo',
                'bar',
                'foobar',
                'baz',
            ]);
        });
    });

    it('run should resolve object', () => {
        const arr = {
            work: doWork,
            work2: doWork(),
            bar: Promise.resolve('bar'),
            foobar: new Promise((resolve) => {
                setTimeout(() => {
                    resolve('foobar');
                }, 1);
            }),
            baz: () => 'baz',
        };

        return Async.run(function * () {
            const values = yield arr;

            expect(values).to.be.deep.equal({
                work: 'foo',
                work2: 'foo',
                bar: 'bar',
                foobar: 'foobar',
                baz: 'baz',
            });
        });
    });

    it('run should execute a generator function', () => {
        return Async.run(function * () {
            const a = yield doWork;
            const b = yield doWork;

            expect(a).to.be.equal('foo');
            expect(b).to.be.equal('foo');

            const res = yield [ doWork, doWork ];
            expect(res).to.be.deep.equal([ 'foo', 'foo' ]);
        });
    });

    it('run should pass arguments', () => {
        return Async.run(function * (num, str, arr, obj, func) {
            expect(47 === num).to.be.true;
            expect('test' === str).to.be.true;
            expect(arr).to.be.instanceOf(Array);
            expect(obj).to.be.instanceOf(Object);
            expect(func).to.be.instanceOf(Function);

            return '1';
        }, 47, 'test', [ 'red' ], {level: 47}, () => {});
    });

    it('run should reject an invalid value yielded', () => {
        const p = Async.run(function * () {
            yield Symbol('test');
        });

        return p.then(() => {
            throw new Error('FAIL');
        }, err => {
            expect(err).to.be.instanceOf(TypeError);
        });
    });

    it('run should reject if error is thrown in async func', () => {
        const p = Async.run(function * () {
            throw new Error('TEST_ERROR');
        });

        return p.then(() => {
            throw new Error('FAIL');
        }, err => {
            expect(err.message).to.be.equal('TEST_ERROR');
        });
    });

    it('run should allow try..catch blocks around yield statements', () => {
        return Async.run(function * () {
            try {
                yield Symbol('test');
            } catch (e) { }
        });
    });

    it('run should de-nodeify callbacks', () => {
        const fn = (cb) => {
            cb(undefined, 'TEST');
        };

        return Async.run(function * () {
            return yield fn;
        }).then(val => {
            expect(val).to.be.equal('TEST');
        });
    });

    it('run should throw if err is set', () => {
        const fn = (cb) => {
            cb(new Error('foobar'), undefined);
        };

        return Async.run(function * () {
            return yield fn;
        }).then(() => {
            throw Error('FAIL');
        }, err => {
            expect(err.message).to.be.equal('foobar');
        });
    });

    it('run should resolve with multiple args', () => {
        const fn = (cb) => {
            cb(undefined, 'foo', 'bar', 'foobar');
        };

        return Async.run(function * () {
            return yield fn;
        }).then((vals) => {
            const [ foo, bar, foobar ] = vals;
            expect(foo).to.be.equal('foo');
            expect(bar).to.be.equal('bar');
            expect(foobar).to.be.equal('foobar');
        });
    });

    let asyncTest;
    if (__jymfony.Platform.hasAsyncFunctionSupport()) {
        // Need to use eval here, as a SyntaxError will be raised if
        // Async/await support is disabled
        eval(`asyncTest = () => {
            let p = Promise.resolve('foobar');

            return Async.run(async function (prom) {
                return await prom;
            }, p).then(val => {
                expect(val).to.be.equal('foobar');
            });
        };`);
    }

    it('run should execute an async function', asyncTest);
});
