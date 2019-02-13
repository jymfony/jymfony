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
     * @inheritdoc
     */
    async stream(out, parameters = {}) {
        try {
            const code = '(async function(out, { ' + Object.keys(parameters).join(', ') + ' }) { ' +
                fs.readFileSync(this._file) + ' });';

            await vm.runInNewContext(code, {filename: this._file})(out, parameters);
        } catch (e) {
            throw new RuntimeException(__jymfony.sprintf('Error while rendering template: %s', e.message), null, e);
        }
    }
}

module.exports = JsTemplate;
