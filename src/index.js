'use strict';
// get the package for the http requests
var request = require('request');
// get XML parser from the package for converting XML to JSON because TCMB api responses with an XML.
var parseString = require('xml2js').parseString;
// get the encoding converter
var iconv = require('iconv-lite');

/**
 * Returns date values within an array if date format is either: 'dd-mm-yyyy' or 'dd.mm.yyyy' or 'dd/mm/yyyy'
 * @param {string} date
 * @returns {Array} An array that contains each date value.
 */
function dateMatch(date) {
    // if it is string and format is correct, for returned array: array[1] is day 'DD', array[2] is month 'MM', array[3] is year 'YYYY'
    // if the format is 'dd-mm-yyyy' accept 2 digits, dash (-), 2 digits, dash(-) and 4 digits.
    if (date.indexOf('-') !== -1) return date.match(/(\d{2})-(\d{2})-(\d{4})/);
    if (date.indexOf('.') !== -1) return date.match(/(\d{2}).(\d{2}).(\d{4})/);
    if (date.indexOf('/') !== -1) return date.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    return;
}

/**
 * Returns date values within an array if date is between currentDate and minYear or returns string 'today' if matchedDate equals to currentDate
 * @param {Array} matchedDate
 * @param {Array} currentDate
 * @param {number} minYear
 * @returns {Array|string} An array that contains each date value as [DD, MM, YY] or string 'today'.
 */
function dateControl(matchedDate, currentDate, minYear) {
    if (!matchedDate || !Array.isArray(matchedDate)) return;

    if (matchedDate && Array.isArray(matchedDate) && matchedDate.length !== 4) return;

    // Year check: Check if the year is smaller than 4 digits or smaller than minimum year or it is greater than current year. 
    if ((matchedDate[3].length < 4) || matchedDate[3] < minYear || matchedDate[3] > currentDate[2]) return;

    // Month check: Check if the month is smaller than 2 digits or it's a value like 0, -1 etc. or it is greater than 12. 		
    if ((matchedDate[2].length < 2) || matchedDate[2] < 1 || matchedDate[2] > 12) return;

    // Day check: Check if the day is smaller than 2 digits or it's a value like 0, -1 etc. or its value is greater than 31 or greater than 30 on april, june, september, november.		
    if ((matchedDate[1].length < 2) || matchedDate[1] < 1 || matchedDate[1] > 31 || (['04', '06', '09', '11'].indexOf(matchedDate[2]) > -1 && matchedDate[1] > 30)) return;

    // February check: Check if it is february and its value is greater than 29 or check if the year is dividable by for and its value is greater than 28.
    if ((matchedDate[2] === '02' && matchedDate[1] > 29) || (matchedDate[2] === '02' && matchedDate[1] > 28 && matchedDate[3] % 4 !== 0)) return;

    // Current day check: If the day, month, year match return 'today'. 
    if (matchedDate[1] === currentDate[0] && matchedDate[2] === currentDate[1] && matchedDate[3] === currentDate[2].toString()) return 'today';

    // return [DD, MM, YY]
    return [matchedDate[1], matchedDate[2], matchedDate[3]];
}

/**
 * Returns date values within an array if date format is either: 'dd-mm-yyyy' or 'dd.mm.yyyy' or 'dd/mm/yyyy' or 'today'
 * @param {string} date
 * @returns {Array|string} An array that contains each date value as [DD, MM, YY] or string 'today'.
 */
function dateParser(date) {
    // Get current day.
    var todayNumber = new Date().getDate();
    // Make the day string and if it is smaller than 10, make it two digits.
    var today = todayNumber < 10 ? '0' + todayNumber.toString() : todayNumber.toString();

    // Get current month. January is 0 with getMonth(), thus we added 1.
    var thisMonthNumber = new Date().getMonth() + 1;

    var thisMonth = thisMonthNumber < 10 ? '0' + thisMonthNumber.toString() : thisMonthNumber.toString();
    // Get current year.
    var thisYear = new Date().getFullYear();
    // TCMB api have no data before 1996.
    var minYear = 1996;

    var matchedDate = dateMatch(date);

    var validDate = dateControl(matchedDate, [today, thisMonth, thisYear], minYear);

    return validDate;
}

/**
 * Checks the date and returns an encoding
 * @param {Array} date
 * @returns {string}
 */
function getEncoding(date) {
    var firstUtfDate = new Date('2016', '08', '08');
    // new Date() expects the date in fomat of YYYY, MM, DD...
    var currentDate = new Date(date[2], date[1], date[0]);
    if (currentDate >= firstUtfDate) return 'UTF-8';
    return 'ISO-8859-9';
}

/**
 * Returns api endpoint
 * @param {string} date
 * @returns {Array}
 */
function getApiUrl(date) {
    var parsedDate;

    if (date && typeof date !== 'string') return;

    if (date && typeof date === 'string' && date.length !== 10 && date.toLowerCase() !== 'today') return;

    if (date && typeof date === 'string' && date.length === 10) parsedDate = dateParser(date);

    if (parsedDate && parsedDate !== 'today') {
        var encoding = getEncoding(parsedDate);
        // return an endpoint in such way: http://www.tcmb.gov.tr/kurlar/YYMM/DDMMYY.xml. i.e. http://www.tcmb.gov.tr/kurlar/200510/12102005.xml
        return ['http://www.tcmb.gov.tr/kurlar/' + parsedDate[2] + parsedDate[1] + '/' + parsedDate[0] + parsedDate[1] + parsedDate[2] + '.xml', encoding];
    }
    // in cases of passed date as null or empty string or string 'today' or parsed date as string 'today', return current day's endpoint.
    if (date === null || date === '' || (typeof date === 'string' && date.toLowerCase() === 'today') || parsedDate === 'today') {
        return ['http://www.tcmb.gov.tr/kurlar/today.xml', 'UTF-8'];
    }

    return;
}

/**
 * Returns the string capitalized
 * @param {string} currency
 * @returns {string|boolean}
 */
function currencyControl(currency) {
    // currency as null or empty string is acceptable.
    if (currency === null || currency === '') {
        return true;
    } else if (typeof currency === 'string' || currency.length === 3) {
        return currency.toUpperCase();
    } else {
        return;
    }
}

/**
 * Returns the parameter if it is string, if it is null or empty string returns true
 * @param {string} dataType
 * @returns {string|boolean}
 */
function dataTypeControl(dataType) {
    // dataType as null or empty string is acceptable.    
    if (dataType === null || dataType === '') return true;
    if (typeof dataType === 'string') return dataType;
    return;
}

/**
 * Returns the float value if it is parsebale to float
 * @param {string} val
 * @returns {number|string}
 */
function valueParser(val) {
    if (val) {
        var floatVal = parseFloat(val);
        if (isNaN(floatVal)) return val;
        return floatVal;
    }
}

/**
 * Converts api data to an object with the key of the currency code. i.e. USD: { BankNoteBuying: [someNumber] }, EUR: { ... }, ...  
 * @param {Array} arr
 * @returns {Object}
 */
function toObject(arr) {
    var dataObject = {};

    for (var i = 0; i < arr.length; i++) {
        dataObject[arr[i]['$']['CurrencyCode']] = arr[i];
    }

    return dataObject;
}

/**
 * Converts api data to an object with the key of the currency code and value of the data type. i.e. USD: { someNumber }, EUR: { someNumber }, ...  
 * @param {Object} obj
 * @param {string} dataType
 * @returns {Object}
 */
function objectMap(obj, dataType) {
    var mappedObj = {};
    for (var key in obj) {
        // assign each key which is currency to data type value in the object
        mappedObj[key] = obj[key][dataType] ? obj[key][dataType] : null;
    }
    return mappedObj;
}

/**
 * Returns the processed api data
 * @param {Object} dataObject
 * @param {string} currency
 * @param {string} validCurrency
 * @param {string} dataType
 * @param {string} validDataType
 * @returns {Object}
 */
function validateObject(dataObject, currency, validCurrency, dataType, validDataType) {
    if (!dataObject) return;
    // if a currency and a data type is chosen and data type isn't '$', check if that currency exists and check if that validDataType exists. return the value of chosen currency and data type
    if (validCurrency && dataType && validDataType && validDataType !== '$' && dataObject.hasOwnProperty(validCurrency) && dataObject[validCurrency].hasOwnProperty(validDataType)) return dataObject[validCurrency][validDataType];
    // if a currency and a data type is chosen and data type is '$', check if that currency exists. return the value of chosen currency and data type
    if (validCurrency && dataType && validDataType && validDataType === '$' && dataObject.hasOwnProperty(validCurrency)) return dataObject[validCurrency][validDataType];
    // if a currency is chosen but data type isn't, check if that currency exists. return the currency object.
    if (validCurrency && !dataType && validDataType && dataObject.hasOwnProperty(validCurrency)) return dataObject[validCurrency];
    // if no currency is chosen and a valid data type is requested, list currencies as a key in an object with the value of data type.
    if (!currency && validCurrency && dataType && validDataType && dataObject['USD'].hasOwnProperty(validDataType)) return objectMap(dataObject, validDataType);

    return;
}

/**
 * Returns the processed api data as promise
 * @param {string} currency
 * @param {string} date
 * @param {string} dataType
 * @param {string} encoding
 * @returns {Promise} Promise object represents the processed api data
 */
module.exports = function tcmb(currency = null, date = null, dataType = null, encoding) {
    var apiUrl = getApiUrl(date);
    var validCurrency = currencyControl(currency);
    var validDataType = dataTypeControl(dataType);

    return new Promise(function (resolve, reject) {

        if (!apiUrl || !Array.isArray(apiUrl) || !apiUrl.length) reject({ message: 'Error! Invalid date.', errorDetail: null, errorCode: 700, statusCode: null });
        
        // currency is chosen, but not valid.
        if (currency && !validCurrency) reject({ message: 'Error! Invalid currency code.', errorDetail: null, errorCode: 701, statusCode: null });

        // if encoding isn't passed as a parameter, get it depending on the date
        encoding = encoding || apiUrl[1];

        var options = {
            method: 'GET',
            url: apiUrl[0],
            encoding: null,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.8,tr;q=0.6',
                'Accept-Charset': encoding
            },
        }

        // GET request to the api endpoint.
        request(options, function (error, response, body) {

            if (error) reject({ message: 'Error! Something went wrong on the request.', errorDetail: error, errorCode: 702, statusCode: null });

            if (response && response.statusCode !== 200) reject({ message: 'Error! Server respond is not ok. Possibly due to public holiday date.', errorDetail: null, errorCode: 703, statusCode: response.statusCode });

            // encoding conversion
            try {
                var xml = iconv.decode(body, encoding);
            } catch (error) {
                reject({ message: 'Error! Invalid encoding type.', errorDetail: error, errorCode: 704, statusCode: null });
            }

            if (!xml || xml.search('Tarih_Date') === -1) reject({ message: 'Error! Invalid XML is received.', errorDetail: null, errorCode: 705, statusCode: null });

            //xml to json conversion
            parseString(xml, {
                trim: true,
                explicitArray: false,
                valueProcessors: [valueParser],
                emptyTag: null
            }, function (error, resultData) {
                if (error) reject({ message: 'Error! Something went wrong while converting XML to JSON', errorDetail: error, errorCode: 706, statusCode: null });
                
                // convert the json data of array of objects to an object with the keys of currencies and value of their regarding values.
                if (resultData) resultData = toObject(resultData['Tarih_Date']['Currency']);

                // if currency and data type are either undefined, null or empty string return all data.
                if (!currency && validCurrency && !dataType && validDataType && resultData) resolve(resultData);

                // check if currency and data type are valid and get proper data.
                var validDataObj = validateObject(resultData, currency, validCurrency, dataType, validDataType);

                // if the proper data exists or empty string, return the data
                if (validDataObj || validDataObj === '') resolve(validDataObj);

                reject({ message: 'Error! No such currency or data type found.', errorDetail: null, errorCode: 707, statusCode: null });
            });
        });
    });
}