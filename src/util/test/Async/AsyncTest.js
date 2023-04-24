const TestCase = Jymfony.Component.Testing.Framework.TestCase;

function * doWork() {
    yield __jymfony.sleep(50);
    return 'foo';
}

const Async = __jymfony.Async;

export default class AsyncTest extends TestCase {
    testRunShouldReturnAPromise() {
        const o = Async.run(function * () {
            yield doWork();
        });

        __self.assertIsPromise(o);
    }

    async testRunShouldHandleNonGeneratorFunctionsWithReturnValue() {
        const func = () => 'bar';

        await Async.run(function * () {
            const ret = yield func;
            const ret2 = yield func();

            __self.assertEquals('bar', ret);
            __self.assertEquals('bar', ret2);
        });
    }

    async testRunShouldHandleNonGeneratorFunctionsWithCallback() {
        const func = cb => {
            cb(undefined, 47);
        };

        await Async.run(function * () {
            const ret = yield func;
            __self.assertEquals(47, ret);
        });
    }

    async testRunShouldResolveArray() {
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

        await Async.run(function * () {
            const values = yield arr;

            __self.assertEquals([
                'foo',
                'foo',
                'bar',
                'foobar',
                'baz',
            ], values);
        });
    }

    async testRunShouldResolveObject() {
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

        await Async.run(function * () {
            const values = yield arr;

            __self.assertEquals({
                work: 'foo',
                work2: 'foo',
                bar: 'bar',
                foobar: 'foobar',
                baz: 'baz',
            }, values);
        });
    }

    async testRunShouldExecuteAGeneratorFunction() {
        await Async.run(function * () {
            const a = yield doWork;
            const b = yield doWork;

            __self.assertEquals('foo', a);
            __self.assertEquals('foo', b);

            const res = yield [ doWork, doWork ];
            __self.assertEquals([ 'foo', 'foo' ], res);
        });
    }

    async testRunShouldPassArguments() {
        await Async.run(function * (num, str, arr, obj, func) {
            __self.assertSame(47, num);
            __self.assertSame('test', str);
            __self.assertIsArray(arr);
            __self.assertIsObject(obj);
            __self.assertIsFunction(func);

            return '1';
        }, 47, 'test', [ 'red' ], {level: 47}, () => {});
    }

    async testRunShouldRejectAnInvalidValueYielded() {
        this.expectException(TypeError);
        await Async.run(function * () {
            yield Symbol('test');
        });
    }

    async testRunShouldRejectIfErrorIsThrownInAsyncFunc() {
        this.expectException(Error);
        this.expectExceptionMessage('TEST_ERROR');

        await Async.run(function * () {
            throw new Error('TEST_ERROR');
        });
    }

    async testRunShouldAllowTryCatchBlocksAroundYieldStatements() {
        this.expectNotToPerformAssertions();
        await Async.run(function * () {
            try {
                yield Symbol('test');
            } catch (e) { }
        });
    }

    async testRunShouldDeNodeifyCallbacks() {
        const fn = (cb) => {
            cb(undefined, 'TEST');
        };

        const val = await Async.run(function * () {
            return yield fn;
        });

        __self.assertEquals('TEST', val);
    }

    async testRunShouldThrowIfErrIsSet() {
        const fn = (cb) => {
            cb(new Error('foobar'), undefined);
        };

        this.expectException(Error);
        this.expectExceptionMessage('foobar');

        await Async.run(function * () {
            return yield fn;
        });
    }

    async testRunShouldResolveWithMultipleArgs() {
        const fn = (cb) => {
            cb(undefined, 'foo', 'bar', 'foobar');
        };

        const [ foo, bar, foobar ] = await Async.run(function * () {
            return yield fn;
        });

        __self.assertEquals('foo', foo);
        __self.assertEquals('bar', bar);
        __self.assertEquals('foobar', foobar);
    }

    async testRunShouldExecuteAnAsyncFunction() {
        const p = Promise.resolve('foobar');
        const val = await Async.run(async function (prom) {
            const v = await prom;
            return v;
        }, p);

        __self.assertEquals('foobar', val);
    }
}
