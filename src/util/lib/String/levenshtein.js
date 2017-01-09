'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Calculates the levenshtein distance between two strings
 *
 * @param {string} s
 * @param {string} t
 *
 * @returns {int}
 */
global.__jymfony.levenshtein = function levenshtein(s, t) {
    // degenerate cases
    if (s == t) {
        return 0;
    }

    if (s.length == 0) {
        return t.length;
    }

    if (t.length == 0) {
        return s.length;
    }

    let v0 = Array(t.length + 1).fill(0);
    let v1 = Array(t.length + 1).fill(0);

    // initialize v0 (the previous row of distances)
    // this row is A[0][i]: edit distance for an empty s
    // the distance is just the number of characters to delete from t
    for (let i = 0; i < v0.length; i++) {
        v0[i] = i;
    }

    for (let i = 0; i < s.length; i++) {
        // calculate v1 (current row distances) from the previous row v0

        // first element of v1 is A[i+1][0]
        //   edit distance is delete (i+1) chars from s to match empty t
        v1[0] = i + 1;

        // use formula to fill in the rest of the row
        for (let j = 0; j < t.length; j++) {
            let cost = (s[i] == t[j]) ? 0 : 1;
            v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
        }

        // copy v1 (current row) to v0 (previous row) for next iteration
        for (let j = 0; j < v0.length; j++) {
            v0[j] = v1[j];
        }
    }

    return v1[t.length];
};
