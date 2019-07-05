const Caster = Jymfony.Component.VarDumper.Caster.Caster;
const ConstStub = Jymfony.Component.VarDumper.Caster.ConstStub;

/**
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
class BufferCaster {
    /**
     * Casts a Date object.
     *
     * @param {Buffer} buffer
     * @param {Object} a
     * @param {Jymfony.Component.VarDumper.Cloner.Stub} stub
     *
     * @returns {Object}
     */
    static castBuffer(buffer, a, stub) {
        stub.class_ += ':' + buffer.length;

        return {
            [Caster.PREFIX_VIRTUAL + 'content']: new ConstStub(buffer.toString('hex').toUpperCase()),
        };
    }
}

module.exports = BufferCaster;
