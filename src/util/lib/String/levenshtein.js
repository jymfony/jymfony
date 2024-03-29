'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * Calculates the levenshtein distance between two strings
 *
 * @param {string} s
 * @param {string} t
 *
 * @returns {int}
 */
__jymfony.levenshtein = (s, t) => {
    // Degenerate cases
    if (s == t) {
        return 0;
    }

    if (0 == s.length) {
        return t.length;
    }

    if (0 == t.length) {
        return s.length;
    }

    const v0 = Array(t.length + 1).fill(0);
    const v1 = Array(t.length + 1).fill(0);

    // Initialize v0 (the previous row of distances)
    // This row is A[0][i]: edit distance for an empty s
    // The distance is just the number of characters to delete from t
    for (let i = 0; i < v0.length; i++) {
        v0[i] = i;
    }

    for (let i = 0; i < s.length; i++) {
        // Calculate v1 (current row distances) from the previous row v0

        // First element of v1 is A[i+1][0]
        //   Edit distance is delete (i+1) chars from s to match empty t
        v1[0] = i + 1;

        // Use formula to fill in the rest of the row
        for (let j = 0; j < t.length; j++) {
            const cost = (s[i] == t[j]) ? 0 : 1;
            v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
        }

        // Copy v1 (current row) to v0 (previous row) for next iteration
        for (let j = 0; j < v0.length; j++) {
            v0[j] = v1[j];
        }
    }

    return v1[t.length];
};
