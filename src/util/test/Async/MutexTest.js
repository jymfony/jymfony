require('../../index');
const expect = require('chai').expect;

describe('Mutex', function () {
    it('ownership should be exclusive', async () => {
        let flag = false;

        const mutex = new __jymfony.Mutex();
        await mutex.acquire();

        setTimeout(() => {
            flag = true;
            mutex.release();
        }, 50);

        await mutex.acquire();
        mutex.release();

        expect(flag).to.be.true;
    });

    it('runExclusive should pass the result (immediate)', async () => {
        const mutex = new __jymfony.Mutex();

        const result = await mutex.runExclusive(() => 10);
        expect(result).to.be.equal(10);
    });

    it('runExclusive should pass the result (promise)', async () => {
        const mutex = new __jymfony.Mutex();

        const result = await mutex.runExclusive(() => Promise.resolve(10));
        expect(result).to.be.equal(10);
    });

    it('runExclusive should pass the exception', async () => {
        const mutex = new __jymfony.Mutex();

        try {
            await mutex.runExclusive(() => {
                throw new Error('foo');
            });
        } catch (e) {
            expect(e).to.be.instanceOf(Error);
            return;
        }

        throw new Error('FAILED TEST');
    });

    it('runExclusive should be exclusive', async () => {
        const mutex = new __jymfony.Mutex();
        let flag = false;

        const ex1 = mutex.runExclusive(async () => {
            await __jymfony.sleep(100);
            flag = true;
        });

        const ex2 = mutex.runExclusive(() => expect(flag).to.be.true);

        await Promise.all([ ex1, ex2 ]);
    });

    it('errors during runExclusive do not leave mutex locked', async () => {
        const mutex = new __jymfony.Mutex();

        try {
            await mutex.runExclusive(() => {
                throw new Error();
            });
        } catch (e) {
            // Do nothing
        }

        expect(mutex.locked).to.be.false;
    });

    it('new mutex should be unlocked', () => {
        const mutex = new __jymfony.Mutex();
        expect(mutex.locked).to.be.false;
    });

    it('mutex locked should reflect the mutex state', async () => {
        const mutex = new __jymfony.Mutex();
        expect(mutex.locked).to.be.false;

        const lock1 = mutex.acquire();
        const lock2 = mutex.acquire();

        expect(mutex.locked).to.be.true;

        await lock1;
        expect(mutex.locked).to.be.true;

        mutex.release();
        expect(mutex.locked).to.be.true;

        await lock2;
        mutex.release();

        expect(mutex.locked).to.be.false;
    });
});
