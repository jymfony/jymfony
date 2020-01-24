import { @Annotation } from '@jymfony/decorators';

export class NotHandledAnnotation {
}

export decorator @NotHandledAnnotation() {
    @Annotation(new NotHandledAnnotation())
}
