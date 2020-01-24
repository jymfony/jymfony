require('../../fixtures/namespace');

const KernelTestUtil = Jymfony.Bundle.FrameworkBundle.Test.KernelTestUtil;
const Request = Jymfony.Component.HttpFoundation.Request;
const { expect } = require('chai');

describe('[FrameworkBundle] TypedController', function () {
    if (! __jymfony.Platform.hasPublicFieldSupport()) {
        beforeEach(function () {
            this.skip();
        });
    }

    it ('services are injected into controller', async () => {
        const kernel = KernelTestUtil.createKernel({ kernelClass: 'Jymfony.Bundle.FrameworkBundle.Tests.Fixtures.Controller.TestKernelWithTypedController' });
        await kernel.boot();

        /**
         * @type {Jymfony.Component.HttpServer.RequestHandler}
         */
        const handler = kernel.container.get('Jymfony.Component.HttpServer.RequestHandler');
        const response = await handler.handle(new Request('http://localhost/first'));

        expect(JSON.parse(response.content)).to.be.deep.equal([
            'Jymfony.Component.EventDispatcher.EventDispatcher',
            'Jymfony.Component.HttpFoundation.Request',
        ]);

        await kernel.shutdown();
    });
});
