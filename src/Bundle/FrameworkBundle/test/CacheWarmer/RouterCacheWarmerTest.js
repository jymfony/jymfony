const RouterCacheWarmer = Jymfony.Bundle.FrameworkBundle.CacheWarmer.RouterCacheWarmer;
const ContainerInterface = Jymfony.Component.DependencyInjection.ContainerInterface;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[FrameworkBundle] RouterCacheWarmer', function () {
    beforeEach(() => {
        /**
         * @type {Jymfony.Component.Testing.Prophet}
         *
         * @private
         */
        this._prophet = new Prophet();

        /**
         * @type {Jymfony.Component.DependencyInjection.ContainerInterface|Jymfony.Component.Testing.Prophecy.ObjectProphecy}
         *
         * @private
         */
        this._container = this._prophet.prophesize(ContainerInterface);

        /**
         * @type {Jymfony.Bundle.FrameworkBundle.CacheWarmer.RouterCacheWarmer}
         *
         * @private
         */
        this._warmer = new RouterCacheWarmer(this._container.reveal());
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it('should be optional', () => {
        expect(this._warmer.optional).to.be.true;
    });

    it('should warmup the router cache', () => {
        const router = this._prophet.prophesize(Jymfony.Component.Routing.RouterInterface);
        this._container.get('router').willReturn(router);

        router.warmUp('/var/cache').shouldBeCalled();

        this._warmer.warmUp('/var/cache');
    });
});
