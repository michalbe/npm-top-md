'use strict';

var npmtop = require('./npmtop');
var nas = require('npm-author-scrape');
var gravatar = require('gravatar');

var ntm = function() {
  npmtop(function(err, all){
    all.forEach(function(us){
      console.log(us.slice(0, 256));
    });
  });
};

var getAuthorData = function(name, cb){
  nas(name, function(user) {
    console.log(gravatar.url(user.email, {s: '200', r: 'pg', d: '404'}));
  });
};

getAuthorData('michalbe');

//ntm();
module.exports = ntm;
