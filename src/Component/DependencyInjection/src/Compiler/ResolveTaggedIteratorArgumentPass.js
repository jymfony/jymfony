const TaggedIteratorArgument = Jymfony.Component.DependencyInjection.Argument.TaggedIteratorArgument;
const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const PriorityTaggedServiceTrait = Jymfony.Component.DependencyInjection.Compiler.PriorityTaggedServiceTrait;

/**
 * Resolves all TaggedIteratorArgument arguments.
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
export default class ResolveTaggedIteratorArgumentPass extends mix(AbstractRecursivePass, PriorityTaggedServiceTrait) {
    /**
     * @inheritdoc
     */
    _processValue(value, isRoot = false) {
        if (value instanceof TaggedIteratorArgument) {
            value.values = this.findAndSortTaggedServices(value.tag, this._container);

            return value;
        }

        return super._processValue(value, isRoot);
    }
}
