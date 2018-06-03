'use strict';

var assert = require('assert');
var tcmb = require('../index');

describe('using the tcmb function', function () {
    it('should get a non-empty object', function (done) {
        tcmb().then(function (data) {
            assert(Object.keys(data).length !== 0 && data.constructor === Object);
            done();
        });
    });

    it('should get an object with the key of "CurrencyName" and its value is "US DOLLAR"', function (done) {
        tcmb('USD').then(function (data) {
            assert(data.hasOwnProperty('CurrencyName') && data['CurrencyName'] === 'US DOLLAR');
            done();
        });
    });

    it('should get an object whose value for the "CurrenyName" key is "DEUTSCHE MARK"', function (done) {
        tcmb('DEM', '09/08/1996').then(function (data) {
            assert(data['CurrencyName'] === 'DEUTSCHE MARK');
            done();
        });
    });

    it('should get a number type value', function (done) {
        tcmb('DEM', '09/08/1996', 'BanknoteBuying').then(function (data) {
            assert(typeof data === 'number');
            done();
        });
    });

    it('should get an object with the key of "EUR"', function (done) {
        tcmb(null, 'TODAY', 'BanknoteBuying').then(function (data) {
            assert(data.hasOwnProperty('EUR'));
            done();
        });
    });

    it('should get an error with the statusCode of 404 and errorCode of 703', function (done) {
        tcmb(null, '10.08.2008', 'BanknoteSelling').then(function (data) {}).catch(function (error) {
            assert(error.statusCode === 404 && error.errorCode === 703);
            done();
        });
    });

    it('should get an error with the errorCode of 707', function (done) {
        tcmb('LOL', '11.11.2011', 'ForexBuying').then(function (data) {}).catch(function (error) {
            assert(error.errorCode === 707);
            done();
        });
    });
});