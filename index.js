'use strict';

var npmtop = require('./npmtop');
var nas = require('npm-author-scrape');
var gravatar = require('gravatar');
var each = require('async').each;
var fs = require('fs');
var gv = require('github-vcard');
var path = process.cwd();
var authors = [];

var ntm = function() {
  npmtop(function(err, all){
    authors = all.slice(0, 256);
    each(authors, function(user, cb) {
      getGravatar(user.author, function(npmAuthorData){
        user.gravatar = npmAuthorData.gravURL;
        user.fullName = npmAuthorData.name || '';
        user.location = '';
        if (npmAuthorData.github) {
          gv(user.author, function(err, data){
            if (!err && data) {
              user.location = data.homeLocation;
              user.company = data.worksFor;
            }
            cb();
          });
        } else {
          cb();
        }
      });
    }, generateList);
  });
};

var getGravatar = function(name, cb) {
  nas(name, function(user) {
    cb({
      name: user.full_name,
      github: user.github || '',
      gravURL: gravatar.url(user.email, {s: '30', r: 'pg', d: 'retro'})
    });
  });
};

var generateList = function() {
  var content = authors.map(function(author) {
    return generateOneRow(author);
  }).join('\n');

  var header = require('./static/header');
  var footer = require('./static/footer');

  fs.writeFile(
    path + '/TOP-NPM-CONTRIBUTORS.md',
    header + content + footer,
    function(err){
      if (err) {
        console.log('Error: ', err);
      } else {
        console.log('File saved in ' + path + '/TOP-NPM-CONTRIBUTORS.md');
      }
    }
  );
};

var generateOneRow = function(author){
  var row = '<tr><th scope="row">' + author.rank +
         '</th><td><a href="http://npmjs.org/~' + author.author +
         '">' + author.author +
         '</a>';
  if (author.fullName) {
    row += ' (' + author.fullName + ')';
  }

  row += '</td><td>' + author.packages +
         '</td><td>' + author.location + '</td>' +
         //'</td><td>' + author.company + '</td>' +
         '<td><img width="30" height="30" src="' + author.gravatar +
         '"></td></tr>';

  return row;
};

module.exports = ntm;
