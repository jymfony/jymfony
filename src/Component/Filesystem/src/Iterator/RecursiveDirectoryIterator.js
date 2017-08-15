const fs = require('fs');
const path = require('path');

/**
 * @memberOf Jymfony.Component.Filesystem.Iterator
 */
class RecursiveDirectoryIterator {
    /**
     * Constructor.
     *
     * @param {string} path
     * @param {int} flags
     */
    __construct(path, flags = 0) {
        this._path = fs.realpathSync(path);
        this._flags = flags;

        this._followSymlinks = flags & __self.FOLLOW_SYMLINKS;
    }

    * [Symbol.iterator]() {
        let dir = fs.readdirSync(this._path);
        let secondStep = [];

        for (let current of dir) {
            current = path.join(this._path, current);

            let childItr = undefined;
            let st = this._followSymlinks ? fs.statSync(current) : fs.lstatSync(current);

            if (st.isDirectory()) {
                childItr = new __self(current, this._flags);
            }

            switch (this._flags & (__self.CHILD_LAST | __self.CHILD_FIRST)) {
                case 0:
                    if (undefined !== childItr) {
                        yield * childItr;
                    }

                    yield current;
                    break;

                case __self.CHILD_LAST:
                    if (undefined !== childItr) {
                        secondStep.push(childItr);
                        secondStep.push(current);
                    } else {
                        yield current;
                    }
                    break;

                case __self.CHILD_FIRST:
                    if (undefined !== childItr) {
                        yield * childItr;
                    }

                    secondStep.push(current);
                    break;
            }
        }

        for (let other of secondStep) {
            if (other instanceof __self) {
                yield * other;
            } else {
                yield other;
            }
        }
    }
}

RecursiveDirectoryIterator.CHILD_FIRST = 1;
RecursiveDirectoryIterator.CHILD_LAST = 2;

RecursiveDirectoryIterator.FOLLOW_SYMLINKS = 4;

module.exports = RecursiveDirectoryIterator;
