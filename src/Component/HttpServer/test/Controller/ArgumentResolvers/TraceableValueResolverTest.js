const Request = Jymfony.Component.HttpFoundation.Request;
const TraceableValueResolver = Jymfony.Component.HttpServer.Controller.ArgumentResolvers.TraceableValueResolver;
const Fixtures = Jymfony.Component.HttpServer.Tests.Fixtures.ArgumentResolver;
const Stopwatch = Jymfony.Component.Stopwatch.Stopwatch;
const { expect } = require('chai');

describe('[HttpServer] TraceableValueResolver', function () {
    it ('should register timings in support', () => {
        const stopwatch = new Stopwatch();
        const resolver = new TraceableValueResolver(new Fixtures.DummyResolver(), stopwatch);
        const request = new Request('/');

        expect(resolver.supports(request, {})).to.be.equal(true);

        const event = stopwatch.getEvent('Jymfony.Component.HttpServer.Tests.Fixtures.ArgumentResolver.DummyResolver.supports');
        expect(event.periods).to.have.length(1);
    });

    it ('should register timings in resolve', async () => {
        const stopwatch = new Stopwatch();
        const resolver = new TraceableValueResolver(new Fixtures.DummyResolver(), stopwatch);
        const request = new Request('/');

        let index = 0;
        await __jymfony.forAwait(resolver.resolve(request, {}), resolved => {
            switch (index++) {
                case 0:
                    expect(resolved).to.be.equal('first');
                    break;

                case 1:
                    expect(resolved).to.be.equal('second');
                    break;
            }
        });

        const event = stopwatch.getEvent('Jymfony.Component.HttpServer.Tests.Fixtures.ArgumentResolver.DummyResolver.resolve');
        expect(event.periods).to.have.length(1);
    });
});
