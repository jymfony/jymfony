const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class MutexTest extends TestCase {
    async testOwnershipShouldBeExclusive() {
        let flag = false;

        const mutex = new __jymfony.Mutex();
        await mutex.acquire();

        setTimeout(() => {
            flag = true;
            mutex.release();
        }, 50);

        await mutex.acquire();
        mutex.release();

        __self.assertTrue(flag);
    }

    async testRunExclusiveShouldPassTheResult() {
        const mutex = new __jymfony.Mutex();

        const result = await mutex.runExclusive(() => 10);
        __self.assertEquals(10, result);
    }

    async testRunExclusiveShouldPassThePromiseResult() {
        const mutex = new __jymfony.Mutex();

        const result = await mutex.runExclusive(() => Promise.resolve(10));
        __self.assertEquals(10, result);
    }

    async testRunExclusiveShouldPassTheException() {
        const mutex = new __jymfony.Mutex();

        this.expectException(Error);
        this.expectExceptionMessage('foo');

        await mutex.runExclusive(() => {
            throw new Error('foo');
        });
    }

    async testRunExclusiveShouldBeExclusive() {
        const mutex = new __jymfony.Mutex();
        let flag = false;

        const ex1 = mutex.runExclusive(async () => {
            await __jymfony.sleep(100);
            flag = true;
        });

        const ex2 = mutex.runExclusive(() => __self.assertTrue(flag));

        await Promise.all([ ex1, ex2 ]);
    }

    async testErrorsDuringRunExclusiveDoNotLeaveMutexLocked() {
        const mutex = new __jymfony.Mutex();

        try {
            await mutex.runExclusive(() => {
                throw new Error();
            });
        } catch {
            // Do nothing
        }

        __self.assertFalse(mutex.locked);
    }

    testNewMutexShouldBeUnlocked() {
        const mutex = new __jymfony.Mutex();
        __self.assertFalse(mutex.locked);
    }

    async testMutexLockedShouldReflectTheMutexState() {
        const mutex = new __jymfony.Mutex();
        __self.assertFalse(mutex.locked);

        const lock1 = mutex.acquire();
        const lock2 = mutex.acquire();

        __self.assertTrue(mutex.locked);

        await lock1;
        __self.assertTrue(mutex.locked);

        mutex.release();
        __self.assertTrue(mutex.locked);

        await lock2;
        mutex.release();

        __self.assertFalse(mutex.locked);
    }
}
