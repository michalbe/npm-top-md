'use strict';

var npmtop = require('./npmtop');

var ntm = function() {
  npmtop(function(err, all){
    all.forEach(function(us){
      console.log(us.slice(0, 256));
    });
  });
};

var getAuthorData = function(name){
  
};

ntm();
module.exports = ntm;
