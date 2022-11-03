const TestAnnotation = Foo.Decorators.TestAnnotation;

/**
 * Annotated class
 *
 * @memberOf Foo
 */
export default
@TestAnnotation({ value: 12 })
@TestAnnotation({ value: 24 })
class Annotated {
    /**
     * @type {Object}
     *
     * @private
     */
    @TestAnnotation({ prop: 'test' })
    accessor _value;

    /**
     * @type {Object}
     *
     * @private
     */
    @TestAnnotation({ prop: 'test' })
    accessor _initValue = 'init';

    @TestAnnotation(null)
    get value() { return 'pizza'; }

    @TestAnnotation()
    getValue() {
        return 'bar';
    }
}
