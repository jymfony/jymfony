require('../../index');
const expect = require('chai').expect;

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

describe('For Await iterator', function () {
    it('should throw if passing a not iterable object', async () => {
        const obj = {};
        let caught;

        try {
            await ForAwait(obj, () => {});
        } catch (e) {
            caught = e;
        }

        expect(caught).not.to.be.undefined;
        expect(caught.message).to.be.equal('[object Object] is not iterable');
    });

    it('should iterates on objects exposing asyncIterator symbol', async () => {
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

        expect(sum).to.be.equal(6);
    });

    it('should iterates on objects exposing iterator symbol', async () => {
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

        expect(sum).to.be.equal(6);
    });

    it('should iterates on objects exposing asyncIterator symbol', async () => {
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

        expect(sum).to.be.equal(3);
        expect(x).to.be.equal(3);
    });

    it('should break the loop and return if iterator returns a value', async () => {
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

        expect(sum).to.be.equal(3);
        expect(ret).to.be.deep.equal({ sum: 3 });
    });

    it('promise should be rejected if an error is thrown inside the loop', async () => {
        let sum = 0;
        let testDone = false;
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
        } catch (e) {
            expect(e.message).to.be.equal('FooBar!');
            testDone = true;
        }

        expect(testDone).to.be.true;
        expect(sum).to.be.equal(3);
    });

    it('promise should be rejected if an error is thrown by callback inside the loop', async () => {
        const collection = [ 1, 2, 3, 4, 5 ];
        const sync_iter = collection[Symbol.iterator]();

        let sum = 0;
        let i = 0;
        let testDone = false;

        try {
            await ForAwait(async(sync_iter, kNext | kReturnPrimitive), (value) => {
                sum += value;
                if (2 === ++i) {
                    throw 'Boo!!'; // eslint-disable-line no-throw-literal
                }
            });
        } catch (e) {
            expect(e).to.be.equal('Boo!!');
            testDone = true;
        }

        expect(testDone).to.be.true;
        expect(sum).to.be.equal(3);
    });
});
