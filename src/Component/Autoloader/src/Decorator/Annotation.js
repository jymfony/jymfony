const Metadata = Jymfony.Component.Autoloader.Decorator.Metadata;

const verifyTarget = (target, annotationTarget, name, kind) => {
    if (target & 0 === annotationTarget) {
        throw new Error('Annotation @' + name + ' is not valid on ' + kind + ' elements');
    }
};

/**
 * @memberOf Jymfony.Component.Autoloader.Decorator
 */
export default function Annotation(target = Annotation.ANNOTATION_TARGET_ALL) {
    return function(value, context) {
        switch (context.kind) {
            case 'class': verifyTarget(Annotation.ANNOTATION_TARGET_CLASS, target, context.name, context.kind); break;
            case 'method': verifyTarget(Annotation.ANNOTATION_TARGET_METHOD, target, context.name, context.kind); break;
            case 'field': verifyTarget(Annotation.ANNOTATION_TARGET_FIELD, target, context.name, context.kind); break;
            case 'getter': verifyTarget(Annotation.ANNOTATION_TARGET_GETTER, target, context.name, context.kind); break;
            case 'setter': verifyTarget(Annotation.ANNOTATION_TARGET_SETTER, target, context.name, context.kind); break;
            case 'accessor': verifyTarget(Annotation.ANNOTATION_TARGET_ACCESSOR, target, context.name, context.kind); break;
            case 'parameter': verifyTarget(Annotation.ANNOTATION_TARGET_PARAMETER, target, context.name, context.kind); break;
        }

        return new Proxy(value, {
            get(target, p, receiver) {
                if ('__self__' === p) {
                    return target;
                }

                return Reflect.get(target, p, receiver);
            },
            apply(target, _, argArray) {
                return Metadata(new target(...argArray));
            },
        });
    };
}

Annotation.ANNOTATION_TARGET_CLASS = 0x0001;
Annotation.ANNOTATION_TARGET_METHOD = 0x0002;
Annotation.ANNOTATION_TARGET_FIELD = 0x0004;
Annotation.ANNOTATION_TARGET_GETTER = 0x0008;
Annotation.ANNOTATION_TARGET_SETTER = 0x0010;
Annotation.ANNOTATION_TARGET_ACCESSOR = 0x0020;
Annotation.ANNOTATION_TARGET_PARAMETER = 0x0040;
Annotation.ANNOTATION_TARGET_ALL = 0xFFFF;
