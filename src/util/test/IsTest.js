const TestCase = Jymfony.Component.Testing.Framework.TestCase;

class InvokableObject {
    __invoke(arg) {
        return 'inv_' + arg;
    }
}

export default class IsTest extends TestCase {
    testIsFunctionShouldWork() {
        __self.assertTrue(isFunction(function () {}));
        __self.assertTrue(isFunction(() => {}));
        __self.assertTrue(isFunction(function * () { }));
        __self.assertTrue(isFunction(async function () { }));
        __self.assertTrue(isFunction(new InvokableObject()));

        if (__jymfony.Platform.hasAsyncGeneratorFunctionSupport()) {
            eval('__self.assertTrue(isFunction(async function* () {}))');
        }

        __self.assertFalse(isFunction('foobar'));
        __self.assertFalse(isFunction(42));
        __self.assertFalse(isFunction({}));
        __self.assertFalse(isFunction([]));
        __self.assertFalse(isFunction([ 'go', 'go' ]));
    }
}
