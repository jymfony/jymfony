const ContainerInterface = Jymfony.Contracts.DependencyInjection.ContainerInterface;
const RouterCacheWarmer = Jymfony.Bundle.FrameworkBundle.CacheWarmer.RouterCacheWarmer;
const TestCase = Jymfony.Component.Testing.Framework.TestCase;

export default class RouterCacheWarmerTest extends TestCase {
    /**
     * @type {Jymfony.Contracts.DependencyInjection.ContainerInterface|Jymfony.Component.Testing.Prophecy.ObjectProphecy}
     *
     * @private
     */
    _container;

    /**
     * @type {Jymfony.Bundle.FrameworkBundle.CacheWarmer.RouterCacheWarmer}
     *
     * @private
     */
    _warmer;

    get testCaseName() {
        return '[FrameworkBundle] ' + super.testCaseName;
    }

    beforeEach() {
        this._container = this.prophesize(ContainerInterface);
        this._warmer = new RouterCacheWarmer(this._container.reveal());
    }

    testShouldBeOptional() {
        __self.assertTrue(this._warmer.optional);
    }

    testShouldWarmUpTheRouterCache() {
        const router = this.prophesize(Jymfony.Component.Routing.RouterInterface);
        this._container.get('router').willReturn(router);

        router.warmUp('/var/cache').shouldBeCalled();

        this._warmer.warmUp('/var/cache');
    }
}
