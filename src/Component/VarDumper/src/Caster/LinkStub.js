import * as path from 'path';
import { existsSync, realpathSync } from 'fs';

const ConstStub = Jymfony.Component.VarDumper.Caster.ConstStub;
const Stub = Jymfony.Component.VarDumper.Cloner.Stub;

/**
 * Represents a file or a URL.
 *
 * @memberOf Jymfony.Component.VarDumper.Caster
 */
export default class LinkStub extends ConstStub {
    /**
     * Constructor.
     *
     * @param {string} label
     * @param {int} line
     * @param {string|null} href
     */
    __construct(label, line = 0, href = null) {
        Stub.prototype.__construct.call(this);

        this.inNodeModules = false;
        this.value = label;

        if (null === href) {
            href = label;
        }

        if (! isString(href)) {
            return;
        }

        if (href.startsWith('file://')) {
            if (href === label) {
                label = label.substr(7);
            }

            href = href.substr(7);
        } else if (-1 !== href.indexOf('://')) {
            this.attr.href = href;

            return;
        }

        if (! existsSync(href)) {
            return;
        }

        if (line) {
            this.attr.line = line;
        }

        if (label !== (this.attr.file = realpathSync(href) || href)) {
            return;
        }

        this.attr.ellipsis = href.length - __jymfony.autoload.rootDir.length + 1;
        this.attr['ellipsis-type'] = 'path';
        this.attr['ellipsis-tail'] = 1 + (this.inNodeModules ? 2 + href.substr(1 - this.attr.ellipsis).split(path.sep).slice(0, 2).join('').length : 0);
    }
}
