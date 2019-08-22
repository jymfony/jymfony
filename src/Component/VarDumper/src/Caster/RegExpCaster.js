const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const ConstStub = Jymfony.Component.VarDumper.Caster.ConstStub;

/**
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class RegExpCaster {
    /**
     * Casts a RegExp object.
     *
     * @param {RegExp} regexp
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     *
     * @returns {Object}
     */
    static castRegExp(regexp, a, stub) {
        stub.class_ = 'RegExp';

        return {
            [Caster.PREFIX_VIRTUAL + 'source']: new ConstStub(regexp.source),
            [Caster.PREFIX_VIRTUAL + 'flags']: new ConstStub(regexp.flags),
        };
    }
}
