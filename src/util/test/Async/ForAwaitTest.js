const TestCase = Jymfony.Component.Testing.Framework.TestCase;

const kNext = 1;
const kThrow = 2;
const kReturn = 4;
const kReturnPrimitive = kReturn | 32;

function async(iterable, features = kNext) {
    const it = iterable[Symbol.iterator]();
    const methods = {
        next(sentValue) {
            return new Promise((resolve, reject) => {
                const {value, done} = it.next(sentValue);
                Promise.resolve(value).then((value) => {
                    resolve({value, done});
                }, (value) => {
                    reject(value);
                });
            });
        },

        throw(sentValue) {
            return new Promise((resolve, reject) => {
                const throwMethod = it.throw;
                if ('function' !== typeof throwMethod) {
                    return reject(sentValue);
                }

                const {value, done} = throwMethod.call(it, sentValue);
                Promise.resolve(value).then((value) => {
                    resolve({ value, done });
                }, (value) => {
                    reject(value);
                });
            });
        },

        return(sentValue) {
            return new Promise((resolve, reject) => {
                const returnMethod = it.return;
                if ('function' !== typeof returnMethod) {
                    if ((features & kReturnPrimitive) === kReturnPrimitive) {
                        return resolve(sentValue);
                    }

                    return resolve({value: sentValue, done: true});
                }

                const {value, done} = returnMethod.call(it, sentValue);
                Promise.resolve(value).then(function(value) {
                    if ((features & kReturnPrimitive) === kReturnPrimitive) {
                        return resolve(value);
                    }

                    resolve({ value, done });
                }, function(value) {
                    reject(value);
                });
            });
        },
    };


    return {
        [Symbol.asyncIterator]() {
            return this;
        },

        next: (features & kNext) ? methods.next : undefined,
        throw: (features & kThrow) ? methods.throw : undefined,
        return: (features & kReturn) ? methods.return : undefined,
    };
}

const ForAwait = __jymfony.forAwait;

export default class ForAwaitTest extends TestCase {
    async testShouldThrowIfPassingANonIterableObject() {
        const obj = {};

        this.expectExceptionMessage('[object Object] is not iterable');
        await ForAwait(obj, () => {});
    }

    async testShouldIterateOnObjectsExposingAsyncIteratorSymbol() {
        const obj = new class {
            * [Symbol.asyncIterator]() {
                yield Promise.resolve(1);
                yield Promise.resolve(2);
                yield 3;
            }
        }();

        let sum = 0;
        await ForAwait(obj, async (value) => {
            sum += value;
        });

        __self.assertEquals(6, sum);
    }

    async testShouldIterateOnObjectsExposingIteratorSymbol() {
        const obj = new class {
            * [Symbol.iterator]() {
                yield Promise.resolve(1);
                yield Promise.resolve(2);
                yield 3;
            }
        }();

        let sum = 0;
        await ForAwait(obj, async (value) => {
            sum += value;
        });

        __self.assertEquals(6, sum);
    }

    async testShouldIterateOnObjectsExposingAsyncIteratorSymbolAndReturningAValue() {
        const obj = new class {
            * [Symbol.asyncIterator]() {
                yield Promise.resolve(1);
                yield Promise.resolve(2);

                return 3;
                yield Promise.resolve(4);
            }
        }();

        let sum = 0;
        const x = await ForAwait(obj, async (value) => {
            sum += value;
        });

        __self.assertEquals(3, sum);
        __self.assertEquals(3, x);
    }

    async testShouldBreakTheLoopAndReturnIfIteratorReturnsAValue() {
        const collection = [ 1, 2, 3, 4, 5 ];
        const sync_iter = collection[Symbol.iterator]();

        let sum = 0;
        let i = 0;

        const ret = await ForAwait(async(sync_iter, kNext | kReturn), async (value) => {
            sum += value;
            if (2 === ++i) {
                return { sum };
            }
        });

        __self.assertEquals(3, sum);
        __self.assertEquals({ sum: 3 }, ret);
    }

    async testPromiseShouldBeRejectedIfAnErrorIsThrownInsideTheLoop() {
        let sum = 0;
        const obj = new class {
            * [Symbol.asyncIterator]() {
                yield 1;
                yield Promise.resolve(2);

                throw new Error('FooBar!');
                yield Promise.resolve(4);
            }
        }();

        try {
            await ForAwait(obj, (value) => {
                sum += value;
            });

            __self.fail();
        } catch (e) {
            __self.assertEquals('FooBar!', e.message);
        }

        __self.assertEquals(3, sum);
    }

    async testPromiseShouldBeRejectedIfAnErrorIsThrownByCallbackInsideTheLoop() {
        const collection = [ 1, 2, 3, 4, 5 ];
        const sync_iter = collection[Symbol.iterator]();

        let sum = 0;
        let i = 0;

        try {
            await ForAwait(async(sync_iter, kNext | kReturnPrimitive), (value) => {
                sum += value;
                if (2 === ++i) {
                    throw 'Boo!!'; // eslint-disable-line no-throw-literal
                }
            });

            __self.fail();
        } catch (e) {
            __self.assertEquals('Boo!!', e);
        }

        __self.assertEquals(3, sum);
    }
}
