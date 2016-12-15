const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const RepeatablePassInterface = Jymfony.DependencyInjection.Compiler.RepeatablePassInterface;
const InvalidArgumentException = Jymfony.DependencyInjection.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.RepeatedPass}
 */
module.exports = class RepeatedPass extends implementationOf(CompilerPassInterface) {
    /**
     * @param {Jymfony.DependencyInjection.Compiler.CompilerPassInterface[]} passes
     */
    constructor(passes) {
        super();

        for (let pass of passes) {
            if (! (pass instanceof RepeatablePassInterface)) {
                throw new InvalidArgumentException('passes must be an array of RepeatablePassInterface.');
            }

            pass.setRepeatedPass(this);
        }

        this._passes = passes;
    }

    /**
     * @inheritDoc
     */
    process(container) {
        do {
            this._repeat = false;

            for (let pass of this._passes) {
                pass.process(container);
            }
        } while (this._repeat);
    }

    /**
     * Sets if the pass should repeat.
     */
    setRepeat() {
        this._repeat = true;
    }

    /**
     * Returns the passes.
     *
     * @returns {Jymfony.DependencyInjection.Compiler.RepeatablePassInterface[]}
     */
    getPasses() {
        return this._passes;
    }
};
