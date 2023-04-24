const AbstractLoader = Jymfony.Component.Validator.Mapping.Loader.AbstractLoader;
const Callback = Jymfony.Component.Validator.Constraints.Callback;
const Constraint = new ReflectionClass(Jymfony.Component.Validator.Annotation.Constraint).getConstructor();
const GroupSequence = Jymfony.Component.Validator.Constraints.GroupSequence;
const GroupSequenceProvider = Jymfony.Component.Validator.Annotation.GroupSequenceProvider;
const MappingException = Jymfony.Component.Validator.Exception.MappingException;

/**
 * Loads validation metadata from class annotations/decorators.
 *
 * @memberOf Jymfony.Component.Validator.Mapping.Loader
 */
export default class AnnotationLoader extends AbstractLoader {
    /**
     * @inheritdoc
     */
    loadClassMetadata(metadata) {
        /**
         * @type {ReflectionClass}
         */
        const reflClass = metadata.reflectionClass;
        const className = reflClass.name;

        for (const [ annotationClass, annotations ] of reflClass.metadata) {
            if (annotationClass === Constraint) {
                for (const annotation of isArray(annotations) ? annotations : [ annotations ]) {
                    metadata.addConstraint(annotation.generateConstraint());
                }
            } else if (annotationClass === GroupSequenceProvider) {
                metadata.setGroupSequenceProvider(true);
            } else if (annotationClass === GroupSequence) {
                metadata.setGroupSequence((isArray(annotations) ? [ annotations.length - 1 ] : annotations).groups);
            }
        }

        for (const field of reflClass.fields) {
            const reflectionField = reflClass.getField(field);

            for (const [ annotationClass, annotations ] of reflectionField.metadata) {
                if (annotationClass !== Constraint) {
                    continue;
                }

                for (const annotation of isArray(annotations) ? annotations : [ annotations ]) {
                    metadata.addFieldConstraint(reflectionField.name, annotation.generateConstraint());
                }
            }
        }

        for (const property of reflClass.properties) {
            if (! reflClass.hasReadableProperty(property)) {
                continue;
            }

            const reflectionProperty = reflClass.getReadableProperty(property);
            for (const [ annotationClass, annotations ] of reflectionProperty.metadata) {
                if (annotationClass !== Constraint) {
                    continue;
                }

                for (const annotation of isArray(annotations) ? annotations : [ annotations ]) {
                    metadata.addPropertyGetterConstraint(reflectionProperty.name, annotation.generateConstraint());
                }
            }
        }

        for (const method of reflClass.methods) {
            const reflectionMethod = reflClass.getMethod(method);

            for (const [ annotationClass, annotations ] of reflectionMethod.metadata) {
                if (annotationClass !== Constraint) {
                    continue;
                }

                for (const annotation of isArray(annotations) ? annotations : [ annotations ]) {
                    const constraint = annotation.generateConstraint();
                    if (constraint instanceof Callback) {
                        constraint.callback = reflectionMethod.name;
                        metadata.addConstraint(constraint);
                    } else {
                        const match = reflectionMethod.name.match(/^(get|is|has)(.+)$/);
                        if (match) {
                            let name = match[1];
                            if (! reflClass.hasReadableProperty(name) && ! reflClass.hasField(name)) {
                                name[0] = name[0].toLowerCase();
                            }

                            if (! reflClass.hasReadableProperty(name) && ! reflClass.hasField(name)) {
                                name = '_' + name;
                            }

                            if (! reflClass.hasReadableProperty(name) && ! reflClass.hasField(name)) {
                                name = match[1];
                            }

                            metadata.addGetterConstraint(name, reflectionMethod.name, constraint);
                        } else {
                            throw new MappingException(__jymfony.sprintf('The constraint on "%s.%s" cannot be added. Constraints can only be added on methods beginning with "get", "is" or "has".', className, reflectionMethod.name));
                        }
                    }
                }
            }
        }
    }
}
