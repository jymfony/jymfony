import { access as accessCallback, constants, stat as statCallback } from 'fs';
import { basename } from 'path';
import { promisify } from 'util';

const ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
const File = Jymfony.Component.Validator.Constraints.File;
const UnexpectedTypeException = Jymfony.Component.Validator.Exception.UnexpectedTypeException;
const UnexpectedValueException = Jymfony.Component.Validator.Exception.UnexpectedValueException;

const access = promisify(accessCallback);
const stat = promisify(statCallback);

const KB_BYTES = 1000;
const MB_BYTES = 1000000;
const KIB_BYTES = 1024;
const MIB_BYTES = 1048576;

/**
 * @memberOf Jymfony.Component.Validator.Constraints
 */
export default class FileValidator extends ConstraintValidator {
    /**
     * @inheritdoc
     */
    async validate(value, constraint) {
        if (! (constraint instanceof File)) {
            throw new UnexpectedTypeException(constraint, File);
        }

        if (null === value || '' === value || undefined === value) {
            return;
        }

        if (! isScalar(value) && ! (value instanceof Jymfony.Component.Filesystem.File)) {
            throw new UnexpectedValueException(value, 'string');
        }

        const path = value instanceof Jymfony.Component.Filesystem.File ? value.filename : String(value);
        const fileStat = await stat(path);

        if (fileStat.isFile()) {
            this._context.buildViolation(constraint.notFoundMessage)
                .setParameter('{{ file }}', this._formatValue(path))
                .setCode(File.NOT_FOUND_ERROR)
                .addViolation();

            return;
        }

        let readable = false;
        try {
            await access(path, constants.R_OK);
            readable = true;
        } catch {
            // Do nothing
        }
        if (! readable) {
            this._context.buildViolation(constraint.notReadableMessage)
                .setParameter('{{ file }}', this._formatValue(path))
                .setCode(File.NOT_READABLE_ERROR)
                .addViolation();

            return;
        }

        const sizeInBytes = fileStat.size;
        const fileBasename = value instanceof Jymfony.Component.HttpFoundation.File.UploadedFile ? value.originalName : basename(path);

        if (0 === sizeInBytes) {
            this._context.buildViolation(constraint.disallowEmptyMessage)
                .setParameter('{{ file }}', this._formatValue(path))
                .setParameter('{{ name }}', this._formatValue(fileBasename))
                .setCode(File.EMPTY_ERROR)
                .addViolation();

            return;
        }

        if (constraint.maxSize) {
            const limitInBytes = constraint.maxSize;

            if (sizeInBytes > limitInBytes) {
                const [ sizeAsString, limitAsString, suffix ] = this._factorizeSizes(sizeInBytes, limitInBytes, constraint.binaryFormat);
                this._context.buildViolation(constraint.maxSizeMessage)
                    .setParameter('{{ file }}', this._formatValue(path))
                    .setParameter('{{ size }}', sizeAsString)
                    .setParameter('{{ limit }}', limitAsString)
                    .setParameter('{{ suffix }}', suffix)
                    .setParameter('{{ name }}', this._formatValue(fileBasename))
                    .setCode(File.TOO_LARGE_ERROR)
                    .addViolation();

                return;
            }
        }

        if (constraint.mimeTypes) {
            let mime;
            if (ReflectionClass.exists('Jymfony.Component.Mime.MimeTypes')) {
                mime = Jymfony.Component.Mime.MimeTypes.instance.guessMimeType(path);
            } else {
                throw new LogicException('You cannot validate the mime-type of files as the Mime component is not installed. Try running "npm install @jymfony/mime".');
            }

            /** @var {string[]} mimeTypes */
            const mimeTypes = isArray(constraint.mimeTypes) ? constraint.mimeTypes : [ constraint.mimeTypes ];
            for (const mimeType of mimeTypes) {
                if (mimeType === mime) {
                    return;
                }

                const discrete = mimeType.indexOf('/*');
                if (-1 !== discrete) {
                    if (mime.substr(0, discrete) === mimeType.substr(0, discrete)) {
                        return;
                    }
                }
            }

            this._context.buildViolation(constraint.mimeTypesMessage)
                .setParameter('{{ file }}', this._formatValue(path))
                .setParameter('{{ type }}', this._formatValue(mime))
                .setParameter('{{ types }}', this._formatValues(mimeTypes))
                .setParameter('{{ name }}', this._formatValue(fileBasename))
                .setCode(File.INVALID_MIME_TYPE_ERROR)
                .addViolation();
        }
    }

    /**
     * Convert the limit to the smallest possible number
     * (i.e. try "MB", then "kB", then "bytes").
     */
    _factorizeSizes(size, limit, binaryFormat) {
        let coef, coefFactor;
        if (binaryFormat) {
            coef = MIB_BYTES;
            coefFactor = KIB_BYTES;
        } else {
            coef = MB_BYTES;
            coefFactor = KB_BYTES;
        }

        let limitAsString = (limit / coef).toFixed(2);

        // Convert size to the same measure, but round to 2 decimals
        let sizeAsString = (size / coef).toFixed(2);

        // If the size and limit produce the same string output
        // (due to rounding), reduce the coefficient
        while (sizeAsString === limitAsString) {
            coef /= coefFactor;
            limitAsString = (limit / coef).toFixed(2);
            sizeAsString = (size / coef).toFixed(2);
        }

        return [ sizeAsString, limitAsString, __self.suffices[coef] ];
    }
}

FileValidator.suffices = {
    1: 'bytes',
    [KB_BYTES]: 'kB',
    [MB_BYTES]: 'MB',
    [KIB_BYTES]: 'KiB',
    [MIB_BYTES]: 'MiB',
};
