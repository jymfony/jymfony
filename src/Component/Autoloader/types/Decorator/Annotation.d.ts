declare namespace Jymfony.Component.Autoloader.Decorator {
    type AnnotationConstructor = {
        ANNOTATION_TARGET_CLASS: number;
        ANNOTATION_TARGET_METHOD: number;
        ANNOTATION_TARGET_FIELD: number;
        ANNOTATION_TARGET_GETTER: number;
        ANNOTATION_TARGET_SETTER: number;
        ANNOTATION_TARGET_ACCESSOR: number;
        ANNOTATION_TARGET_PARAMETER: number;
        ANNOTATION_TARGET_ALL: number;

        (target?: number): <T>(value: T, context: any) => T;
    }

    export var Annotation: AnnotationConstructor;
}
