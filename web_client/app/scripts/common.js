'use strict';

var wpsp = wpsp || {};

wpsp.API_SERVER = 'http://210.129.195.213:3003';
wpsp.API_BASE = wpsp.API_SERVER + '/api/v1';

wpsp.utils = {};

wpsp.utils.round = function(num, digit) {
  num = num * Math.pow(10, digit);
  num = Math.round(num);
  num = num / Math.pow(10, digit);
  return num;
}
