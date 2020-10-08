const KernelTestUtil = Jymfony.Bundle.FrameworkBundle.Test.KernelTestUtil;
const Prophet = Jymfony.Component.Testing.Prophet;
const { expect } = require('chai');

describe('[FrameworkBundle] AnnotatedControllerLoader', function () {
    if (! __jymfony.Platform.hasPublicFieldSupport()) {
        beforeEach(function () {
            this.skip();
        });
    }

    beforeEach(() => {
        this._prophet = new Prophet();
    });

    afterEach(() => {
        this._prophet.checkPredictions();
    });

    it ('should load controller namespace correctly', async () => {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Routing.TestKernel' });
        await kernel.boot();

        /** @type {Jymfony.Component.Routing.Router} */
        const router = kernel.container.get('router');
        expect(router.routeCollection).to.have.length(2);

        const first = router.routeCollection.get('jymfony_framework_tests_fixtures_routing_annotated_first');
        expect(first).not.to.be.undefined;
        expect(first.path).to.be.equal('/this/is/first/action');
        expect(first.defaults._controller).to.be.equal('Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Routing.AnnotatedController:firstAction');

        await kernel.shutdown();
    });
});
