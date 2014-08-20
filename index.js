'use strict';

var npmtop = require('./npmtop');
var nas = require('npm-author-scrape');
var gravatar = require('gravatar');
var each = require('async').each;
var fs = require('fs');
//var path = process.cwd();

var authors = [];
var ntm = function() {
  npmtop(function(err, all){
    authors = all.slice(0, 256);
    each(authors, function(user, cb) {
      getGravatar(user.author, function(npmAuthorData){
        user.gravatar = npmAuthorData.gravURL;
        user.fullName = npmAuthorData.name;
        cb();
      });
    }, generateList);
  });
};

var getGravatar = function(name, cb) {
  nas(name, function(user) {
    cb({
      name: user.full_name,
      gravURL: gravatar.url(user.email, {s: '30', r: 'pg', d: '404'})
    });
  });
};

var generateList = function() {
  var content = authors.map(function(author) {
    return generateOneRow(author);
  }).join('\n');

  var header = require('./static/header');
  var footer = require('./static/footer');

  fs.writeFile('./LIST.md', header + content + footer, function(err){
    if (err) {
      console.log('LYPA', err);
    } else {
      console.log('done!');
    }
  })
};

var generateOneRow = function(author){
  return '<tr><th scope="row">' + author.rank +
         '</th><td><a href="http://npmjs.org/~' + author.author +
         '">' + author.author +
         '</a> (' + author.fullName +
         ')</td><td>' + author.packages +
         '</td><td></td>' + ' Location ' +
         '<td><img width="30" height="30" src="' + author. gravatr +
         '"></td></tr>';
};

ntm();
module.exports = ntm;
