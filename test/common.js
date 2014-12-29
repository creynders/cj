/* jshint -W024, expr:true */
/*jslint node: true */
/*global expect, fx, sinon*/
'use strict';

var Must = require('must');

//expose as globals.
global.expect = Must;
global.fx = require('./data');
global.sinon = require('sinon');