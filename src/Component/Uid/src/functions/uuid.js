import { randomBytes } from 'crypto';

const collator = new Intl.Collator();
const UUID_REGEX = /^(?<time_low>[0-9a-f]{8})-(?<time_mid>[0-9a-f]{4})-(?<version>[0-9a-f])(?<time_hi>[0-9a-f]{3})-(?<clock_seq>[0-9a-f]{4})-(?<node>[0-9a-f]{12})$/i;

// https://tools.ietf.org/html/rfc4122#section-4.1.4
// 0x01b21dd213814000 is the number of 100-ns intervals between the
// UUID epoch 1582-10-15 00:00:00 and the Unix epoch 1970-01-01 00:00:00.
export const TIME_OFFSET_INT = 0x01b21dd213814000;
export const TIME_OFFSET_BIN = '\x01\xb2\x1d\xd2\x13\x81\x40\x00';
export const TIME_OFFSET_COM = '\xfe\x4d\xe2\x2d\xec\x7e\xc0\x00';

export const UUID_TYPE_NULL = -1;
export const UUID_TYPE_INVALID = -42;

export const uuid_is_valid = uuid => null !== uuid.match(UUID_REGEX);
export const uuid_parse = uuid => {
    const matches = uuid.match(UUID_REGEX);
    if (! matches) {
        return null;
    }

    return {
        time: '0' + matches.groups.time_hi + matches.groups.time_mid + matches.groups.time_low,
        version: Number.parseInt(matches.groups.version, 16),
        clock_seq: Number.parseInt(matches.groups.clock_seq, 16),
        node: matches.groups.node,
    };
};

export const uuid_type = uuid => {
    uuid = String(uuid);
    if ('00000000-0000-0000-0000-000000000000' === uuid) {
        return UUID_TYPE_NULL;
    }

    const parsed = uuid_parse(uuid);
    if (null === parsed) {
        return false;
    }

    return parsed.version;
};


export const uuid_compare = (uuid1, uuid2) => {
    uuid1 = String(uuid1);
    uuid2 = String(uuid2);

    if (! uuid1.match(UUID_REGEX)) {
        return false;
    }

    if (! uuid2.match(UUID_REGEX)) {
        return false;
    }

    return collator.compare(uuid1, uuid2);
};

/**
 * @param [uuid_type = 4]
 *
 * @returns {string}
 */
export const uuid_create = (uuid_type = 4) => {
    if (! isNumeric(uuid_type) && null !== uuid_type) {
        throw new Error(__jymfony.sprintf('uuid_create() expects parameter 1 to be int, %s given', typeof uuid_type));
    }

    switch (uuid_type) {
        case 1:
            return uuid_generate_time();

        case 4:
            return uuid_generate_random();

        default:
            throw new Error(__jymfony.sprintf('Unknown/invalid UUID type \'%d\' requested, using default type instead', uuid_type));
    }
};

export const uuid_time = uuid => {
    const parsed = uuid_parse(String(uuid));
    if (null === parsed) {
        return false;
    }

    if (1 !== parsed.version) {
        return false;
    }

    return ~~((Number.parseInt(parsed.time, 16) - TIME_OFFSET_INT) / 10000000);
};

let node = null;

/**
 * @see http://tools.ietf.org/html/rfc4122#section-4.2.2
 *
 * @returns {string}
 */
export const uuid_generate_time = () => {
    const hrTime = process.hrtime();
    let time = hrTime[0] * 1000000 + hrTime[1] / 1000;

    time = __jymfony.str_pad((time + TIME_OFFSET_INT).toString(16), 16, '0', __jymfony.STR_PAD_LEFT);

    // https://tools.ietf.org/html/rfc4122#section-4.1.5
    // We are using a random data for the sake of simplicity: since we are
    // Not able to get a super precise timeOfDay as a unique sequence
    const clockSeq = Math.floor(Math.random() * 0x4000);

    if (null === node) {
        node = __jymfony.sprintf('%06x%06x',
            Math.floor(Math.random() * 0x1000000) | 0x010000,
            Math.floor(Math.random() * 0x1000000)
        );
    }

    return __jymfony.sprintf('%08s-%04s-1%03s-%04x-%012s',
        // 32 bits for "time_low"
        time.substr(time.length - 8),

        // 16 bits for "time_mid"
        time.substr(time.length - 12, 4),

        // 16 bits for "time_hi_and_version", four most significant bits holds version number 1
        time.substr(time.length - 15, 3),

        // 16 bits:
        // * 8 bits for "clk_seq_hi_res",
        // * 8 bits for "clk_seq_low",
        // Two most significant bits holds zero and one for variant DCE1.1
        clockSeq | 0x8000,

        // 48 bits for "node"
        node
    );
};

/**
 * @returns {string}
 */
export const uuid_generate_random = () => {
    const uuid = randomBytes(16).toString('hex');

    return __jymfony.sprintf('%08s-%04s-4%03s-%04x-%012s',
        // 32 bits for "time_low"
        uuid.substr(0, 8),
        // 16 bits for "time_mid"
        uuid.substr(8, 4),
        // 16 bits for "time_hi_and_version",
        // 4 most significant bits holds version number 4
        uuid.substr(13, 3),
        // 16 bits:
        // * 8 bits for "clk_seq_hi_res",
        // * 8 bits for "clk_seq_low",
        // 2 most significant bits holds zero and one for variant DCE1.1
        Number.parseInt(uuid.substr(16, 4), 16) & 0x3fff | 0x8000,
        // 48 bits for "node"
        uuid.substr(20, 12)
    );
};

export const uuid_mac = uuid => {
    const parsed = uuid_parse(String(uuid));
    if (null === parsed) {
        return false;
    }

    if (1 !== parsed.version) {
        return false;
    }

    return __jymfony.strtr(parsed.node, 'ABCDEF', 'abcdef');
};
