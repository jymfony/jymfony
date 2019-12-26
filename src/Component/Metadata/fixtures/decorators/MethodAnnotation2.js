import { @Annotation } from '@jymfony/decorators';

export class MethodAnnotation2 {
}

export decorator @MethodAnnotation2() {
    @Annotation(new MethodAnnotation2())
}
