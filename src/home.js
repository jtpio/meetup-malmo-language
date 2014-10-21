'use strict';

var path = require('path');
var url = require('url');
var request = require('request');
var analyzer = require(path.resolve(__dirname, './analyzer.js'))();

var malmo = {'question': 2187832, 'url': 'intercambio3'};

var MEETUP_KEY = process.env.MEETUP_KEY;
var QUESTION_ID = malmo.question;
var REFRESH_TIME = 1000 * 60 * 30;

var urlObj = {
    protocol: 'https',
    host: 'api.meetup.com',
    pathname: '/2/profiles',
    query: {
        group_urlname: malmo.url,
        sign: true,
        key: MEETUP_KEY
    }
};

var dest = url.format(urlObj);

function crawl(destUrl) {

    request.get(destUrl, function (err, response, body) {
        if (err) {
            console.log(err);
            return;
        }
        var res = JSON.parse(body);
        var results = res.results;

        for (var i = 0; i < results.length; i++) {
            var answers = results[i].answers;
            for (var j = 0; j < answers.length; j++) {
                if (answers[j].question_id === QUESTION_ID) {
                    analyzer.extractLanguage(answers[j].answer);
                }
            }
        }

        if (res.meta.hasOwnProperty('next') && res.meta.next !== '') {
            crawl(res.meta.next);
        } else {
            analyzer.printResults();
        }
    });
}

crawl(dest);

setInterval(function () {
    analyzer.init();
    crawl(dest);
}, REFRESH_TIME);


module.exports.getLanguages = function (req, res) {
    res.send(analyzer.getResults());
};