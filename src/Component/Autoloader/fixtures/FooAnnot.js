import { @Annotation } from '@jymfony/decorators';

export default class FooAnnot {
    __construct(values = {}) {
        this._values = values;
    }

    get value() {
        return this._values;
    }
}

export decorator @FooAnnot(values = {}) {
    @Annotation(new FooAnnot(values))
    @initialize(() => {})
}
