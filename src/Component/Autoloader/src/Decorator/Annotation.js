const Metadata = Jymfony.Component.Autoloader.Decorator.Metadata;

const verifyTarget = (target, annotationTarget, name, kind, value = undefined) => {
    if ((annotationTarget & target) !== target) {
        throw new Error(__jymfony.sprintf('Annotation @%s is not valid on %s elements' + (value ? '(%s)' : ''), name, kind, value));
    }
};

class Annotation {
    /**
     * @param {int} target
     */
    constructor(target) {
        /**
         * @type {int}
         *
         * @private
         */
        this._target = target;
    }

    /**
     * @returns {int}
     */
    get target() {
        return this._target;
    }
}

/**
 * @memberOf Jymfony.Component.Autoloader.Decorator
 */
export default function AnnotationImpl(targets = Annotation.ANNOTATION_TARGET_ALL) {
    return function(value, context) {
        const metadataName = context.name;
        MetadataStorage.addMetadata(Annotation, new Annotation(targets), context.metadataKey, null);

        return new Proxy(value, {
            get(target, p, receiver) {
                if ('__self__' === p) {
                    return target;
                }

                return Reflect.get(target, p, receiver);
            },
            apply(target, _, argArray) {
                const metadataFn = Metadata(new target(...argArray));

                return function (target, context) {
                    const formattedName = (() => {
                        if ('class' === context.kind) {
                            return ReflectionClass.getClassName(target);
                        }

                        const className = context.class ? context.class.name : '';
                        const memberName = context.name;

                        return __jymfony.sprintf('%s%s%s', className || '', className && memberName ? ':' : '', memberName || '');
                    })();

                    switch (context.kind) {
                        case 'class': verifyTarget(Annotation.ANNOTATION_TARGET_CLASS, targets, metadataName, context.kind, formattedName); break;
                        case 'method': verifyTarget(Annotation.ANNOTATION_TARGET_METHOD, targets, metadataName, context.kind, formattedName); break;
                        case 'field': verifyTarget(Annotation.ANNOTATION_TARGET_FIELD, targets, metadataName, context.kind, formattedName); break;
                        case 'getter': verifyTarget(Annotation.ANNOTATION_TARGET_GETTER, targets, metadataName, context.kind, formattedName); break;
                        case 'setter': verifyTarget(Annotation.ANNOTATION_TARGET_SETTER, targets, metadataName, context.kind, formattedName); break;
                        case 'accessor': verifyTarget(Annotation.ANNOTATION_TARGET_ACCESSOR, targets, metadataName, context.kind, formattedName); break;
                        case 'parameter': verifyTarget(Annotation.ANNOTATION_TARGET_PARAMETER, targets, metadataName, context.kind); break;
                    }

                    return metadataFn(target, context);
                };
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

AnnotationImpl.ANNOTATION_TARGET_CLASS = 0x0001;
AnnotationImpl.ANNOTATION_TARGET_METHOD = 0x0002;
AnnotationImpl.ANNOTATION_TARGET_FIELD = 0x0004;
AnnotationImpl.ANNOTATION_TARGET_GETTER = 0x0008;
AnnotationImpl.ANNOTATION_TARGET_SETTER = 0x0010;
AnnotationImpl.ANNOTATION_TARGET_ACCESSOR = 0x0020;
AnnotationImpl.ANNOTATION_TARGET_PARAMETER = 0x0040;
AnnotationImpl.ANNOTATION_TARGET_ALL = 0xFFFF;
