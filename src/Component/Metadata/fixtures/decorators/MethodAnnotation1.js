import { @Annotation } from '@jymfony/decorators';

export class MethodAnnotation1 {
}

export decorator @MethodAnnotation1() {
    @Annotation(new MethodAnnotation1())
}
