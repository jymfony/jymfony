import { @Annotation } from '../src/decorators';

export default class FooAnnot {
    __construct(values = {}) {
        this._values = values;
    }

    get value() {
        return this._values;
    }
}

export decorator @FooAnnot(values = {}) {
    @Annotation(FooAnnot, new FooAnnot(values))
}
