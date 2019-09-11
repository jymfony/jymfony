import { readFileSync } from 'fs';
import { runInNewContext } from 'vm';

const TemplateInterface = Jymfony.Component.Templating.Template.TemplateInterface;

/**
 * @memberOf Jymfony.Component.Templating.Template
 */
export default class JsTemplate extends implementationOf(TemplateInterface) {
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
                readFileSync(this._file) + ' });';

            await runInNewContext(code, {filename: this._file})(out, parameters);
        } catch (e) {
            throw new RuntimeException(__jymfony.sprintf('Error while rendering template: %s', e.message), null, e);
        }
    }
}
