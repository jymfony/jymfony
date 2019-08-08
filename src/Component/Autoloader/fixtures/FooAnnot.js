@Annotation()
class FooAnnot {
    __construct(values = {}) {
        this._values = values;
    }

    get value() {
        return this._values;
    }
}

module.exports = FooAnnot;
