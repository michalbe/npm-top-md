'use strict';

var npmtop = require('./npmtop');
var nas = require('npm-author-scrape');
var gravatar = require('gravatar');
var each = require('async').each;
var authors = [];
var ntm = function() {
  npmtop(function(err, all){
    authors = all.slice(0, 256);
    each(authors, function(user, cb) {
      getGravatar(user.author, function(gravURL){
        user.gravatar = gravURL;
        cb();
      });
    }, generateList);
  });
};

var getGravatar = function(name, cb){
  nas(name, function(user) {
    cb(gravatar.url(user.email, {s: '30', r: 'pg', d: '404'}));
  });
};

var generateList = function() {
  console.log(authors);
};

ntm();
module.exports = ntm;
