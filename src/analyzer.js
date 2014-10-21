'use strict';

var path = require('path');
var _ = require('lodash');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var dictEN = require(path.resolve(__dirname, '../data/languages-en.json'));

module.exports = function() {

    var DISTANCE_THREHOLD = 0.89;
    var total;
    var bilinguals;
    var unknown;
    var results;
    var res;

    function _normalize(str) {
        return str.trim().toLowerCase();
    }

    function _init() {
        total = 0;
        bilinguals = 0;
        unknown = []; // not matched
        res = {};
        results = {};
    }

    _init();

    return {

        init: _init,

        extractLanguage: function (str) {
            if (!str) return;
            var tokens = _.uniq(_.map(tokenizer.tokenize(str), function (t) {
                return _normalize(t);
            }));

            var m = 0;
            tokens.forEach(function (t) {
                if (dictEN[t]) {
                    res[t] = (res[t] + 1) || 1;
                    m++;
                }
            });

            if (m === 0) {
                // no match
                tokens.forEach(function (t) {
                    for (var lang in dictEN) {
                        var dist = natural.JaroWinklerDistance(lang, t);
                        if (dist > DISTANCE_THREHOLD) {
                            // console.log('comparing token', t, ' with lang ', lang, ', got distance: ', dist);
                            res[lang] = (res[lang] + 1) || 1;
                            m++;
                            break; // stop for this language
                        }
                    }
                });
            }

            if (m === 0) {
                unknown.push(str);
            } else if (m > 1) {
                bilinguals++;
            }

            total++;

        },

        printResults: function () {
            results = {
                'fetched': Date.now(),
                'total': total,
                'bilinguals': bilinguals,
                'unknown': unknown,
                'languages': res
            };
        },

        getResults: function () {
            return results;
        }

    };

};
