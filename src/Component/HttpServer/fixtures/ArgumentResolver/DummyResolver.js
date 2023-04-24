const ArgumentValueResolverInterface = Jymfony.Component.HttpServer.Controller.ArgumentValueResolverInterface;

/**
 * @memberOf Jymfony.Component.HttpServer.Tests.Fixtures.ArgumentResolver
 */
export default class DummyResolver extends implementationOf(ArgumentValueResolverInterface) {
    /**
     * @inheritdoc
     */
    async supports(request, argument) {
        return true;
    }

    /**
     * @inheritdoc
     */
    * resolve(request, argument) {
        yield 'first';
        yield 'second';
    }
}
