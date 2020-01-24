import { @ClassAnnot, @MethodAnnotation1, @MethodAnnotation2, @NotHandledAnnotation } from './decorators';

@ClassAnnot()
@NotHandledAnnotation()
export default class SimpleObject
{
    @NotHandledAnnotation()
    _createdAt;

    #author;

     @NotHandledAnnotation()
     @MethodAnnotation1()
     @MethodAnnotation2()
    getAuthor() {
        return this.#author;
    }
}
