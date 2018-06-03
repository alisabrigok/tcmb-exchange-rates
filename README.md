# CBRT EXCHANGE RATES FETCHER (TCMB DÖVİZ KURU KÜTÜPHANESİ)

Get exchange rates announced by the Central Bank of the Republic of Turkey (as known as CBRT or TCMB) easily with options:

  - Currency, 
  - Date, 
  - Data type,
  - Encoding 

Türkiye Cumhuriyeti Merkez Bankası (TCMB) tarafından yayınlanan döviz kurlarını kolayca;

  - Kur, 
  - Tarih, 
  - Veri türü,
  - Encoding 

seçenekleriyle çekmenizi sağlayan kütüphane.

Türkçe dökümantasyon için: [Tıklayın](https://github.com/alisabrigok/tcmb-exchange-rates/blob/master/README.tr.md)

## Description

This package gets any given date's exchage rates from 
http://www.tcmb.gov.tr/kurlar/today.xml
or
http://www.tcmb.gov.tr/kurlar/YYMM/DDMMYY.xml
API endpoints and converts it to more desirable ways with given parameters.

By using this package you can get exchange rates related to :

- Turkish Lira equivalent of foreign currencies: 'Currency X to Turkish Lira' (available all the time).
- Foreign currency equivalent of Dollar: 'Dollar to currency X' (available most of the time).
- Foreign currency equivalent of Euro: 'Euro to currency X' (available some of the time).
- Other currency equivalences (rarely available).

Basically you get one function up to four parameters and get the data in various ways. Does it sound nice and simple enough? 

## Prerequisites

Learn how to [consume promises](https://scotch.io/tutorials/javascript-promises-for-dummies#toc-consuming-promises).

## Installation

Simplest way to install `tcmb-exchange-rates`  is using [npm](https://www.npmjs.com/package/tcmb-exchange-rates) which will download the package and its dependencies.

```
$ npm install tcmb-exchange-rates --save
```

Or you can download it from GitHub.

## Usage

### tcmb(currencyCode, date, dataType, encoding)

You will just use a function with up to four parameters which which will return a promise. 

The simplest way to use the package is just invoking the function. This will return a promise object with current day's exchange rate datas from the CBRT's API.

```
var tcmb = require('tcmb-exchange-rates');
tcmb()
	.then(function(data) {
		console.log(data);
	})
	.catch(function(error) {
		console.log(error);
	});
```

When using this way, the fetched data will be in a form of an object with the keys of currency codes and value of another object with key as data types and value as its whichever value there is for a given date:

``
{
	USD: {
		...,
		"ForexSelling": 4.6005,
		"BanknoteBuying": 4.589,
		...
	},
	EUR: { ... }
}
``

The API provided by CBRT returns the data as XML. Even when you convert it to JSON, you get a chunk of data that is a bit messed up. By using this package though, the data is grouped under the keys of currency codes. Which is nice and neat.

### Parameters

- #### currencyCode: String (3  Char Long), Null, Empty String.

The first parameter that is optionally can be passed as an argument is currency code. This will then return the data types related with that currency. Most of the data type values are Turkish Lira equivalent of that currency.

Currency code is a 3 character long string, that is official unique currency code under ISO 4217 standard. [The full list can be found from here.](https://www.xe.com/iso4217.php) It is **case insensitive** for this package.

e.g. 'USD' returns datas related with Dollar or 'EUR' for Euro etc.

```
var tcmb = require('tcmb-exchange-rates');
tcmb('USD')
	.then(function(data) {
		console.log(data);
	})
	.catch(function(error) {
		console.log(error);
	});
```
Will return all exchange rate data types related with Dollar in an object:

``
{
	USD: {
		...,
		"ForexSelling": 4.6005,
		"BanknoteBuying": 4.589,
		...
	}
}
``

If null, empty string or no parameters passed as an argument; all data types and their values under the keys of currency codes will be fetched from the API, just like invoking the function without any parameters.

- #### date: String ('DD.MM.YYYY', 'DD-MM-YYYY', 'DD/MM/YYYY'), String ('today'), Null, Empty String

The second parameter that is optionally can be passed as an argument is date. This will then return the datas of that given date.

Date should be a string in the format of either 'DD.MM.YYYY’, ‘DD-MM-YYYY’or ‘DD/MM/YYYY'. In any case it is in day/month/year format and expected to be 10 character long.

```
var tcmb = require('tcmb-exchange-rates');
tcmb('EUR', '10/08/2005')
	.then(function(data) {
		console.log(data);
	})
	.catch(function(error) {
		console.log(error);
	});
```
Will return all exchange rate data types, mostly Turkish Lira equivalent of Euro, that are belong to 10 August 2005 in an object:

``
{
	EUR: {
		...,
		"ForexSelling": 1.6348,
		"BanknoteBuying": 1.6259,
		...
	}
}
``

If string 'today', null, empty string or no parameters passed as an argument; the current day's datas will be fetched from the API.

- #### dataType: String, Null, Empty String

The third parameter that is optionally can be passed as an argument is data type. This will then return either the exact value or an object.

Data type can be one of the below and it is **case sensitive**:

- **'Unit'**: The currency unit that is either 1 or 100. i.e. for Dollar it's 1, for Japanese Yen it's 100 most of the time.
- **'Isim'**: Turkish translation of the currency name.
- **'CurrencyName'**: Name of the curreny.
- **'ForexBuying'**: Forex buying value of given currency's Turkish Lira equivalent.
- **'ForexSelling'**: Forex selling value of given currency's Turkish Lira equivalent.
- **'BanknoteBuying'**: Bank note buying value of given currency's Turkish Lira equivalent.
- **'BanknoteSelling'**: Bank note selling value of given currency's Turkish Lira equivalent.
- **'CrossRateUSD'**: Dollar equivalent of given currency.
- **'CrossRateOther'**: Other currency equivalent of given curreny. 
- **'CrossRateEuro'**: Euro equivalent of given currency.
- **'Parite'**: Parity value.

In case of passing a data type as a third parameter along with a currency code as a first parameter, just the value of given currency's given data type will return.

```
var tcmb = require('tcmb-exchange-rates');
tcmb('GBP', 'Today', 'BanknoteSelling' )
	.then(function(data) {
		console.log(data);
	})
	.catch(function(error) {
		console.log(error);
	});
```
Will return bank note selling value of Turkish Lira equivalent of Pound Sterling as a number type, that is belong to the current day:

``
6.1383
``

In case of passing a data type as a third parameter without any currency code being passed in the first parameter, an object that consists of all of the currencies as a key and their provided data type's value as a value will return.

```
var tcmb = require('tcmb-exchange-rates');
tcmb(null, 'Today', 'ForexBuying' )
	.then(function(data) {
		console.log(data);
	})
	.catch(function(error) {
		console.log(error);
	});
```

Will return Forex buying values of Turkish Lira equivalent of all foreign currencies in an object with the keys as currencies and values as Forex buying value:

``
{
	USD: 4.5922,
	AUD: 3.4566,
	DKK: 0.72015,
	EUR: 5.3686,
	GBP: 6.0973,
	...
}
``

If null, empty string or no parameters passed as an argument; this part will have no effect on the data being fetched.

- #### encoding:  String, Null, Empty String

The forth and the last parameter that is optionally can be passed as an argument is encoding. This will then return the data using the provided encoding.

By default, in order to use the correct encoding that is used in the API:


**'ISO-8859-9'** is used until the date of '08.08.2016' and **'UTF-8'** is used on '08.08.2016' and after.


That is due to fix the problematic Turkish characters that's caused by the way the encoding in the API is used.

If you want to change the encoding, for whatever reason, you can do so by passing an encoding as a string.

## Error Handling

In case of any error due to request failure or XML conversion failure or whatever reason, an object with the keys of:

- **message**: Error message that describes the error,
- **errorDetail**: Error description created by an external resource such as dependencies (optional, value might be null),
- **errorCode**: Error code, in order to make dealing with error easier,
- **statusCode**: Server request status code (optional, value might be null)

is created and passed with the promise that will be expected to be handled.

### Error Codes

All of them are numbers that begin from 700 whose message key value in the object is pretty self explanatory.

- **700**: 'Invalid date',
- **701**: 'Invalid currency code',
- **702**: 'Something went wrong on the request',
- **703**: 'Server respond is not ok. Possibly due to public holiday date',
- **704**: 'Invalid encoding type',
- **705**: 'Invalid XML is received',
- **706**: 'Something went wrong while converting XML to JSON',
- **707**: 'No such currency or data type found'

Why 700s you say? How would I know, I just made them up. If there is a convention for creating custom error codes, let me know. I know there is, I read it once somewhere but I couldn't remember. And I didn't find it necessary to use meaningful codes, that I learnt in the university back in the days, for this project. Still, we can talk about it.

## Things To Be Aware Of

- CBRT's API responds with 404 status code on the dates of public holidays in Turkey, including weekends. In cases of being unlucky and passing such date as a second parameter you will get an error with the error code of 703. As of now, I haven't come up with a solution to retrieve and return the previous non-holiday date's datas. That's because, man Turkey has so much public holdays. Hit me up with an email if you want to contribute solving this issue, unless I do it before you.

Note: In case of trying to get the current day's data on public holidays, you will get the very last working day's data.

- No data is provided before the year of 1996. To be precise, the API is available on 16 April 1996 (16/04/1996) and onwards.

- Data type is case sensitive. You have to pass it the way given above.

## Dependencies

- [request](https://www.npmjs.com/package/request): Used for HTTP request.
- [xml2js](https://www.npmjs.com/package/xml2js): Used for converting XML to JSON.
- [iconv-lite](https://www.npmjs.com/package/xml2js): Used for converting character encodings.

## Author

- Ali Sabri GÖK - You can contact me [@alisabrigok](https://twitter.com/alisabrigok) on Twitter, you can email me or visit [my website](http://www.alisabri.com).

## Contribution

No code that is written single handed is perfect. This package's might not be even 'meh'. But that's the thing, less talk more action. So come on now, contribute some. Let's fix it, develop it more together. That's the whole purpose of open source, isn't it?

Frankly, the idea of developing a simple package of mine was beginning to evolve something bigger in order to provide more features, and that was happenning without a proper plan. I decided to release the package in order to not to lose the quality of the code as soon as it hit me. The codes can be refactored more and the project can be enhanced with more features. But that's it for now. If you've used it and liked it, thank you.

## Acknowledgments

- I'd like to thank my cats; Fındık and Minnak. Thanks guys♥. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/alisabrigok/tcmb-exchange-rates/blob/master/LICENSE) file for details.
