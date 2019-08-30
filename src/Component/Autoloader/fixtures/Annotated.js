import { @FooAnnot } from './FooAnnot';

/**
 * Annotated class
 *
 * @memberOf Foo
 */
@FooAnnot({ value: 12 })
@FooAnnot({ value: 24 })
export default class Annotated {
    /**
     * @type {Object}
     *
     * @private
     */
    @FooAnnot({ prop: 'test' })
    _value;

    /**
     * @type {Object}
     *
     * @private
     */
    @FooAnnot({ prop: 'test' })
    _initValue = 'init';

    @FooAnnot(null)
    get value() { return 'pizza'; }

    @FooAnnot
    getValue() {
        return 'bar';
    }
}
