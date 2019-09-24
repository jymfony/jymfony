import { Inject, Parameter } from '../../decorators';
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const DIParameter = Jymfony.Component.DependencyInjection.Parameter;
const Reference = Jymfony.Component.DependencyInjection.Reference;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveClassPass extends AbstractRecursivePass {
    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (! (value instanceof Definition)) {
            return super._processValue(value, isRoot);
        }

        const class_ = value.getClass();
        if (! ReflectionClass.exists(class_)) {
            return;
        }

        const reflClass = new ReflectionClass(class_);
        for (const field of reflClass.fields) {
            const reflField = reflClass.getField(field);
            for (const [ , annotation ] of reflField.metadata) {
                if (annotation instanceof Inject) {
                    value.addProperty(field, new Reference(annotation.serviceId));
                } else if (annotation instanceof Parameter) {
                    value.addProperty(field, new DIParameter(annotation.parameterName));
                }
            }
        }
    }
}
