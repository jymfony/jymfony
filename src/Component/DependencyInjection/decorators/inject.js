import { @Annotation } from '@jymfony/decorators';

export class Inject {
    __construct(serviceId) {
        this._serviceId = serviceId;
    }

    get serviceId() {
        return this._serviceId;
    }
}

export decorator @Inject(serviceId) {
    @Annotation(Inject, new Inject(serviceId))
}
