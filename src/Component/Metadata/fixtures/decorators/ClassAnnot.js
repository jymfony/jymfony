import { @Annotation } from '@jymfony/decorators';

export class ClassAnnot {
}

export decorator @ClassAnnot() {
    @Annotation(new ClassAnnot())
}
