import { expect } from 'chai';

const Argument = Jymfony.Component.Testing.Argument.Argument;
const CacheItemInterface = Jymfony.Contracts.Cache.CacheItemInterface;
const CacheTestPool = Jymfony.Contracts.Fixtures.CacheTestPool;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class CacheTraitTest extends TestCase {
    async testSave() {
        const item = this.prophesize(CacheItemInterface);
        item.set(Argument.any()).willReturn(item);
        item.isHit().willReturn(false);
        item.get().willReturn();

        item.set('computed data')
            .shouldBeCalledTimes(1)
            .willReturn(item);

        const cache = new class extends CacheTestPool {
            getItem(key) {
                return item.reveal();
            }
        }

        const callback = () => 'computed data';
        await cache.get('key', callback);
    }

    async testNoCallbackCallOnHit()
    {
        const item = this.prophesize(CacheItemInterface);
        item.isHit().willReturn(true);
        item.set(Argument.any()).shouldNotBeCalled();
        item.get().willReturn();

        const cache = new class extends CacheTestPool {
            getItem(key) {
                return item.reveal();
            }
        }

        const callback = () => { throw new Error('This code should never be reached') };
        await cache.get('key', callback);
    }

    async testRecomputeOnBetaInfinity() {
        const item = this.prophesize(CacheItemInterface);
        item.isHit().willReturn(true);
        item.set(Argument.any()).willReturn(item);
        item.get().willReturn();

        item.set('computed data')
            .shouldBeCalledTimes(1)
            .willReturn(item);

        const cache = new class extends CacheTestPool {
            getItem(key) {
                return item.reveal();
            }
        }

        const callback = () => 'computed data';
        await cache.get('key', callback, Infinity);
    }

    async testExceptionOnNegativeBeta() {
        const item = this.prophesize(CacheItemInterface);
        const cache = new class extends CacheTestPool {
            getItem(key) {
                return item.reveal();
            }
        }

        const callback = () => 'computed data';

        try {
            await cache.get('key', callback, -2);
            throw new Error('FAIL');
        } catch (e) {
            expect(e).to.be.instanceOf(InvalidArgumentException);
        }
    }
}
