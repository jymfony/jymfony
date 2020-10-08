const InvalidArgumentException = Jymfony.Contracts.Translation.Exception.InvalidArgumentException;
const getDefaultLocale = () => {
    const env = process.env;
    return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
};

/**
 * A trait to help implement TranslatorInterface and LocaleAwareInterface.
 *
 * @memberOf Jymfony.Contracts.Translation
 */
class TranslatorTrait {
    __construct() {
        this._locale = null;
    }

    /**
     * @inheritDoc
     */
    set locale(locale) {
        this._locale = String(locale);
    }

    /**
     * @inheritDoc
     */
    get locale() {
        return this._locale || getDefaultLocale();
    }

    /**
     * @inheritDoc
     */
    trans(id, parameters = {}, locale = null) {
        id = String(id);

        if (! parameters['%count%'] || ! isNumeric(parameters['%count%'])) {
            return __jymfony.strtr(id, parameters);
        }

        const number = Number.parseFloat(parameters['%count%']);
        locale = String(locale || this.locale);

        let parts = [], matches;
        if (id.match(/^\|+$/)) {
            parts = id.split('|');
        } else {
            const regex = /(?:\|\||[^\|])+/g;
            parts = [];

            while ((matches = regex.exec(id))) {
                parts.push(matches[0]);
            }
        }

        const intervalRegexp = /^(?<interval>({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|(?<left_delimiter>[\[\]])\s*(?<left>-Inf|\-?\d+(\.\d+)?)\s*,\s*(?<right>\+?Inf|\-?\d+(\.\d+)?)\s*(?<right_delimiter>[\[\]]))\s*(?<message>.*?)$/s;

        const standardRules = [];
        for (let part of parts) {
            part = __jymfony.trim(part.replace(/\|\|/g, '|'));

            // Try to match an explicit rule, then fallback to the standard ones
            if ((matches = part.match(intervalRegexp))) {
                if (matches[2]) {
                    for (const n of matches[3].split(',')) {
                        if (number == n) {
                            return __jymfony.strtr(matches.groups.message, parameters);
                        }
                    }
                } else {
                    const leftNumber = '-Inf' === matches.groups.left ? -Infinity : Number.parseFloat(matches.groups.left);
                    const rightNumber = isNumeric(matches.groups.right) ? Number.parseFloat(matches.groups.right) : Infinity;

                    if (('[' === matches.groups.left_delimiter ? number >= leftNumber : number > leftNumber)
                        && (']' === matches.groups.right_delimiter ? number <= rightNumber : number < rightNumber)
                    ) {
                        return __jymfony.strtr(matches.groups.message, parameters);
                    }
                }
            } else if ((matches = part.match(/^\w+\:\s*(.*?)$/))) {
                standardRules.push(matches[1]);
            } else {
                standardRules.push(part);
            }
        }

        const position = this.getPluralizationRule(number, locale);

        if (undefined === standardRules[position]) {
            // When there's exactly one rule given, and that rule is a standard
            // Rule, use this rule
            if (1 === parts.length && undefined !== standardRules[0]) {
                return __jymfony.strtr(standardRules[0], parameters);
            }

            const message = __jymfony.sprintf('Unable to choose a translation for "%s" with locale "%s" for value "%d". Double check that this translation has the correct plural options (e.g. "There is one apple|There are %%count%% apples").', id, locale, number);
            throw new InvalidArgumentException(message);
        }

        return __jymfony.strtr(standardRules[position], parameters);
    }

    /**
     * Returns the plural position to use for the given locale and number.
     *
     * The plural rules are derived from code of the Zend Framework (2010-09-25),
     * which is subject to the new BSD license (http://framework.zend.com/license/new-bsd).
     * Copyright (c) 2005-2010 Zend Technologies USA Inc. (http://www.zend.com)
     *
     * @param {number} number
     * @param {string} locale
     *
     * @returns {int}
     */
    getPluralizationRule(number, locale) {
        switch ('pt_BR' !== locale && 3 < locale.length ? locale.substr(0, locale.lastIndexOf('_')) : locale) {
            case 'af':
            case 'bn':
            case 'bg':
            case 'ca':
            case 'da':
            case 'de':
            case 'el':
            case 'en':
            case 'eo':
            case 'es':
            case 'et':
            case 'eu':
            case 'fa':
            case 'fi':
            case 'fo':
            case 'fur':
            case 'fy':
            case 'gl':
            case 'gu':
            case 'ha':
            case 'he':
            case 'hu':
            case 'is':
            case 'it':
            case 'ku':
            case 'lb':
            case 'ml':
            case 'mn':
            case 'mr':
            case 'nah':
            case 'nb':
            case 'ne':
            case 'nl':
            case 'nn':
            case 'no':
            case 'oc':
            case 'om':
            case 'or':
            case 'pa':
            case 'pap':
            case 'ps':
            case 'pt':
            case 'so':
            case 'sq':
            case 'sv':
            case 'sw':
            case 'ta':
            case 'te':
            case 'tk':
            case 'ur':
            case 'zu':
                return (1 == number) ? 0 : 1;

            case 'am':
            case 'bh':
            case 'fil':
            case 'fr':
            case 'gun':
            case 'hi':
            case 'hy':
            case 'ln':
            case 'mg':
            case 'nso':
            case 'pt_BR':
            case 'ti':
            case 'wa':
                return ((0 == number) || (1 == number)) ? 0 : 1;

            case 'be':
            case 'bs':
            case 'hr':
            case 'ru':
            case 'sh':
            case 'sr':
            case 'uk':
                return ((1 == number % 10) && (11 != number % 100)) ? 0 : (((2 <= number % 10) && (4 >= number % 10) && ((10 > number % 100) || (20 <= number % 100))) ? 1 : 2);

            case 'cs':
            case 'sk':
                return (1 == number) ? 0 : (((2 <= number) && (4 >= number)) ? 1 : 2);

            case 'ga':
                return (1 == number) ? 0 : ((2 == number) ? 1 : 2);

            case 'lt':
                return ((1 == number % 10) && (11 != number % 100)) ? 0 : (((2 <= number % 10) && ((10 > number % 100) || (20 <= number % 100))) ? 1 : 2);

            case 'sl':
                return (1 == number % 100) ? 0 : ((2 == number % 100) ? 1 : (((3 == number % 100) || (4 == number % 100)) ? 2 : 3));

            case 'mk':
                return (1 == number % 10) ? 0 : 1;

            case 'mt':
                return (1 == number) ? 0 : (((0 == number) || ((1 < number % 100) && (11 > number % 100))) ? 1 : (((10 < number % 100) && (20 > number % 100)) ? 2 : 3));

            case 'lv':
                return (0 == number) ? 0 : (((1 == number % 10) && (11 != number % 100)) ? 1 : 2);

            case 'pl':
                return (1 == number) ? 0 : (((2 <= number % 10) && (4 >= number % 10) && ((12 > number % 100) || (14 < number % 100))) ? 1 : 2);

            case 'cy':
                return (1 == number) ? 0 : ((2 == number) ? 1 : (((8 == number) || (11 == number)) ? 2 : 3));

            case 'ro':
                return (1 == number) ? 0 : (((0 == number) || ((0 < number % 100) && (20 > number % 100))) ? 1 : 2);

            case 'ar':
                return (0 == number) ? 0 : ((1 == number) ? 1 : ((2 == number) ? 2 : (((3 <= number % 100) && (10 >= number % 100)) ? 3 : (((11 <= number % 100) && (99 >= number % 100)) ? 4 : 5))));

            default:
                return 0;
        }
    }
}

export default getTrait(TranslatorTrait);
