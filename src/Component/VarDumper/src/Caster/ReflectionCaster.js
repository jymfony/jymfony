const Caster = Jymfony.Component.VarDumper.Caster.Caster;

/**
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class ReflectionCaster {
    /**
     * @param {ReflectionClass} obj
     *
     * @returns {Object}
     */
    static castReflectionClass(obj) {
        return {
            [Caster.PREFIX_VIRTUAL + 'classname']: obj.name,
            [Caster.PREFIX_VIRTUAL + 'namespace']: obj.namespaceName,
            [Caster.PREFIX_VIRTUAL + 'fields']: obj.fields,
            [Caster.PREFIX_VIRTUAL + 'methods']: obj.methods,
            [Caster.PREFIX_VIRTUAL + 'properties']: obj.properties,
            [Caster.PREFIX_VIRTUAL + 'constants']: obj.constants,
        };
    }
}
