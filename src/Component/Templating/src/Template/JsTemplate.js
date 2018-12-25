const TemplateInterface = Jymfony.Component.Templating.Template.TemplateInterface;
const fs = require('fs');
const vm = require('vm');

/**
 * @memberOf Jymfony.Component.Templating.Template
 */
class JsTemplate extends implementationOf(TemplateInterface) {
    /**
     * Constructor.
     *
     * @param {string} file
     */
    __construct(file) {
        /**
         * @type {string}
         *
         * @private
         */
        this._file = file;
    }

    /**
     * Renders a template.
     *
     * @param {Function} out Function that streams out data from rendered template.
     * @param {Object.<string, *>} [parameters = {}] A set of parameters to pass to the template
     *
     * @throws {RuntimeException} if the template cannot be rendered
     *
     * @returns {Promise<void>}
     */
    async stream(out, parameters = {}) {
        try {
            const code = '(async function(out, { ' + Object.keys(parameters).join(', ') + ' }) { ' +
                fs.readFileSync(this._file) + ' });';

            await vm.runInNewContext(code, {filename: this._file})(out, parameters);
        } catch (e) {
            throw e;
            throw new RuntimeException(__jymfony.sprintf('Error while rendering template: %s', e.message), null, e);
        }
    }
}

module.exports = JsTemplate;
