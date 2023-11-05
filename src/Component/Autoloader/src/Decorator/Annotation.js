const Metadata = Jymfony.Component.Autoloader.Decorator.Metadata;
const MetadataHelper = require('../Metadata/MetadataHelper');

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
        if ('class' !== context.kind) {
            throw new Error(__jymfony.sprintf('Annotation @Annotation is not valid on %s elements', context.kind));
        }

        const metadataName = context.name;
        MetadataStorage.addMetadata(Annotation, new Annotation(targets), MetadataHelper.getMetadataTarget(context));

        return new Proxy(value, {
            get(target, p, receiver) {
                if (Symbol.for('jymfony.namespace.class') === p || '__self__' === p) {
                    return target;
                }

                return Reflect.get(target, p, receiver);
            },
            has: (target, key) => {
                if (Symbol.for('jymfony.namespace.class') === key) {
                    return true;
                }

                return Reflect.has(target, key);
            },
            apply(target, _, argArray) {
                const metadataFn = Metadata(new target(...argArray));

                return function (target, context) {
                    switch (context.kind) {
                        case 'class': verifyTarget(Annotation.ANNOTATION_TARGET_CLASS, targets, metadataName, context.kind, context.name); break;
                        case 'method': verifyTarget(Annotation.ANNOTATION_TARGET_METHOD, targets, metadataName, context.kind, context.name); break;
                        case 'field': verifyTarget(Annotation.ANNOTATION_TARGET_FIELD, targets, metadataName, context.kind, context.name); break;
                        case 'getter': verifyTarget(Annotation.ANNOTATION_TARGET_GETTER, targets, metadataName, context.kind, context.name); break;
                        case 'setter': verifyTarget(Annotation.ANNOTATION_TARGET_SETTER, targets, metadataName, context.kind, context.name); break;
                        case 'accessor': verifyTarget(Annotation.ANNOTATION_TARGET_ACCESSOR, targets, metadataName, context.kind, context.name); break;
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
