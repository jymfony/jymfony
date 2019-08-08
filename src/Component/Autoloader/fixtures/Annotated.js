const FooAnnot = Foo.FooAnnot;

/**
 * Annotated class
 *
 * @memberOf Foo
 */
@FooAnnot({ value: 12 })
class Annotated {
    /**
     * @type {Object}
     *
     * @private
     */
    @FooAnnot({ prop: 'test' })
    _value;

    @FooAnnot(null)
    get value() { return 'pizza'; }
}

module.exports = Annotated;
