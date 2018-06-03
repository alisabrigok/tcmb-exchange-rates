# CBRT EXCHANGE RATES FETCHER (TCMB DÖVİZ KURU KÜTÜPHANESİ)

[![Build Status](https://travis-ci.org/alisabrigok/tcmb-exchange-rates.svg?branch=master)](https://travis-ci.org/alisabrigok/tcmb-exchange-rates)
[![Coverage Status](https://coveralls.io/repos/github/alisabrigok/tcmb-exchange-rates/badge.svg?branch=master)](https://coveralls.io/github/alisabrigok/tcmb-exchange-rates?branch=master)

Türkiye Cumhuriyeti Merkez Bankası (TCMB) tarafından yayınlanan döviz kurlarını kolayca;

  - Kur, 
  - Tarih, 
  - Veri türü,
  - Encoding 

seçenekleriyle çekmenizi sağlayan kütüphane.

For English: [Click Here](https://github.com/alisabrigok/tcmb-exchange-rates/blob/master/README.md)

## Tanım

Bu kütüphane herhangi bir tarihe ait döviz kurlarını:
http://www.tcmb.gov.tr/kurlar/today.xml
ya da
http://www.tcmb.gov.tr/kurlar/YYMM/DDMMYY.xml
API noktalarından alır ve bunları verilebilecek parametreler aracılığıyla daha kullanılabilir bir hale dönüştürür.

Bu kütüphaneyi kullanarak aşağıdaki ilgili döviz kurları verilerine ulaşabilirsiniz:

- Yabancı para birimlerinin Türk Lirası karşılığı: X Kurunun Türk Lirası karşılığı (her zaman mevcut).
- Doların, yabancı para birimleri karşılığı: Doların, X Kuru karşılığı (genellikle mevcut).
- Euro'nun, yabancı para birimleri karşılığı: Euro'nun, X Kuru karşılığı (bazen mevcut).
- Diğer yabancı para birimlerinin birbirlerine olan karşılıkları (nadir olarak mevcut).

Özetlemek gerekirse, dört parametreye kadar kullanabileceğiniz bir fonksiyonu çağırarak verileri farklı şekillerde alıyorsunuz. Nasıl, kulağa yeterince iyi ve basit geliyor mu? 

## Ön Koşullar

[Promise](https://scotch.io/tutorials/javascript-promises-for-dummies#toc-consuming-promises) kullanmayı öğrenin.

## Kurulum

`tcmb-exchange-rates` kütüphanesini kurmanın en basit yolu [npm](https://www.npmjs.com/package/tcmb-exchange-rates) aracılığıyla kütüphaneyi ve bağlı paketlerini (dependencies) sorunsuz ve uğraşsız bir şekilde tek hamlede indirmek:

```
$ npm install tcmb-exchange-rates --save
```

Ya da GitHub'dan bu kütüphaneyi indirebilir, projenize katabilirsiniz.

## Kullanım

### tcmb(kurKodu, tarih, veriTürü, encoding)

Dört parametreye kadar kullanabileceğiniz bu fonksiyonu çağırıyorsunuz, bu da size bir promise olarak dönüyor.

Kütüphanenin en basit kullanımı argümansız bir şekilde fonksiyonu çağırmak. Bu, o günkü döviz kurlarını TCMB API'ndan veri olarak içeren bir promise objesi dönüyor.

```
var tcmb = require('tcmb-exchange-rates');
tcmb()
	.then(function(veri) {
		console.log(veri);
	})
	.catch(function(hata) {
		console.log(hata);
	});
```

Bu şekilde kullanarak alınan veri, kur kodlarının 'key' olduğu bir obje olarak alınıyor. Ve bu kur kodu 'key' inin değeri, 'key' olarak veri türünü içeren ve değerinin bu veri türlerinin değerleri olduğu başka bir obje. Yani:

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

TCMB tarafından sağlanan API, veriyi XML olarak veriyor. Bu veriyi JSON'a çevirsen bile elde ettiğin veri yığını biraz düzensiz. Bu kütüphaneyi kullanarak veriler kur kodu 'key' i altında gruplanıyorlar. Bu da gayet temiz ve kolay bir kullanım imkanı sağlıyor.

### Parametreler

- #### kurKodu: String (3  Karakter Uzunluğunda), Null, Boş String.

Kur kodu, opsiyonel olarak kullanılabilen ilk parametredir. Bu, o kurun veri türlerini içeren bir veri döner. Bu veri türlerinin değerlerinin çoğu o kurun Türk Lirası karşılığıdır.

Kur kodu, ISO 4217 standartı altında resmi, eşsiz, 3 karakter uzunluğunda bir string olan bir kur kodudur. [Tüm kur kodlarının listesine buradan ulaşılabilir.](https://www.xe.com/iso4217.php) Bu kütüphane için **karakter duyarsız** bir şekildedir, yani büyük küçük yazmanız farketmez. 

Örnek: 'USD' kur kodu Dolar ile alakalı verileri döner ya da 'EUR' kur kodu Euro ile alakalı olanlarını vs.

```
var tcmb = require('tcmb-exchange-rates');
tcmb('USD')
	.then(function(veri) {
		console.log(veri);
	})
	.catch(function(hata) {
		console.log(hata);
	});
```
Bu kod, Dolar ile alakalı döviz kuru veri türlerini bir obje içerisinde döner.

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

Eğer null ya da boş string argüman olarak kullanılmışsa ya da hiçbir parametre argüman olarak kullanılmamışsa, tıpkı fonksiyonu parametresiz çağırdığımızdaki gibi, tüm veri türleri ve bunların değerleri API'dan çekilir ve kur kodları 'key'leri altında gruplanmış şekilde bir obje olarak döner.

- #### tarih: String ('GG.AA.YYYY', 'GG-AA-YYYY', 'GG/AA/YYYY'), String ('today'), Null, Boş String

Tarih, opsiyonel olarak kullanılabilen ikinci parametredir. Bu verilen tarihe dair olan verileri döner.

Tarih,  'GG.AA.YYYY’, ‘GG-AA-YYYY’or ‘GG/AA/YYYY' formatında olan bir string olmalıdır. Hangi ayıraçla bu formatta kullanılırsa kullanılsın gün/ay/yıl formatında ve toplamda 10 karakter uzunluğunda olmalıdır.

```
var tcmb = require('tcmb-exchange-rates');
tcmb('EUR', '10/08/2005')
	.then(function(veri) {
		console.log(veri);
	})
	.catch(function(hata) {
		console.log(hata);
	});
```

Bu kod, 10 Ağustos 2005 tarihine ait döviz kurlarının, çoğunluğu Euro'nun Türk Lirası karşılığı olan, Euro ile alakalı veri türlerini bir obje içerisinde döner.

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

Eğer 'today' string'i, null ya da boş string argüman olarak kullanılmışsa ya da hiçbir parametre argüman olarak kullanılmamışsa, o anki bulunulan güne ait veriler API'dan çekilecektir.

- #### veriTürü: String, Null, Empty String

Veri türü, opsiyonel olarak kullanılabilen üçüncü parametredir. Bu verilen veri türüne ait tam bir değer ya da bir obje döner.

Veri türü parametresi, aşağıdaki string'lerden herhangi biri olabilir. Ayrıca bu parametre **karakter duyarlıdır**, yani büyük küçük harf yazımına dikkat edilmeli:

- **'Unit'**: Seçilen kur birimi, 1 ya da 100. Örneğin doların birimi 1 iken, çoğu zaman Japon Yeni'ninki 100'dür.
- **'Isim'**: Seçilen kur adının Türkçe karşılığı.
- **'CurrencyName'**: Seçilen kur adının İngilizce karşılığı.
- **'ForexBuying'**: Seçilen kurun Türk Lirası karşılığının efektif alış değeridir.
- **'ForexSelling'**: Seçilen kurun Türk Lirası karşılığının efektif satış değeridir.
- **'BanknoteBuying'**: Seçilen kurun Türk Lirası karşılığının döviz alış değeridir.
- **'BanknoteSelling'**: Seçilen kurun Türk Lirası karşılığının döviz satış değeridir.
- **'CrossRateUSD'**: Doların, seçilen kur karşılığıdır.
- **'CrossRateOther'**: Diğer kurun, seçilen kur karşılığıdır. 
- **'CrossRateEuro'**: Euro'nun, seçilen kur karşılığıdır.
- **'Parite'**: Parite değeri.

Birinci parametre olarak kur kodunun ve üçüncü parametre olarak veri türünün birlikte kullanıldığı durumlarda, sadece seçilen kura ait seçilen veri türünün değeri dönecektir. Yani:

```
var tcmb = require('tcmb-exchange-rates');
tcmb('GBP', 'Today', 'BanknoteSelling' )
	.then(function(veri) {
		console.log(veri);
	})
	.catch(function(hata) {
		console.log(hata);
	});
```

Bu kod Pound Sterling'in Türk Lirası karşılığının o anki bulunulan güne ait döviz satış değerini, numara veri tipi olarak döner.

``
6.1383
``

Birinci parametre olarak herhangi bir kur kodunun kullanılmadığı ancak üçüncü parametre olarak bir veri türünün kullanıldığı durumlarda, bütün kurların tek tek 'key' olarak bulunduğu ve bunların değeri olarak, seçilen veri türünün değerinin bulunduğu bir obje dönecektir. Yani:

```
var tcmb = require('tcmb-exchange-rates');
tcmb(null, 'Today', 'ForexBuying' )
	.then(function(veri) {
		console.log(veri);
	})
	.catch(function(hata) {
		console.log(hata);
	});
```

Bu kod o anki bulunulan güne ait bütün yabancı kurların Türk Lirası karşılığının efektif alış değerini, kurların 'key' olduğu ve değerlerinin efektif alış değeri olduğu bir obje döner.

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

Eğer null ya da boş string kullanılmışsa veya hiçbir parametre argüman olarak kullanılmamışsa, bu kısım verinin çekilmesi üzerinde hiçbir etkiye sahip olmayacaktır.

- #### encoding:  String, Null, Boş String

Encoding, opsiyonel olarak kullanılabilen dördüncü ve son parametredir. Bu, verilen encoding türünü kullanarak veriyi döner. 

Varsayılan olarak API'da kullanılan doğru encoding'i kullanmak için:

**'ISO-8859-9'** encoding türü '08.08.2016' tarihine kadar kullanılmış ve **'UTF-8'** encoding türü '08.08.2016' tarihinde ve sonrasında kullanılmıştır.

Bunun nedeni API'da kullanılan encoding türü yüzünden ortaya çıkan Türkçe karakter bozulmalarını düzeltmek içindir.

Eğer bir nedenden ötürü encoding türünü değiştirmek istiyorsanız, bunu encoding türünü string olarak fonksiyonda argüman olarak kullanarak yapabilirsiniz.

## Hata Durumları

Sunucu isteği hatası veya XML çevirisinin doğru çalışmaması ya da herhangi bir neden yüzünden oluşan hatalarda:

- **message**: Hatayı tanımlayan hata mesajı,
- **errorDetail**: Dış kaynaklar tarafından, mesela bağlı paketler, oluşan hata tanımlamaları (opsiyoneldir, değer null olabilir),
- **errorCode**: Hata kodu, hata ile baş etmeyi kolaylaştırma açısından,
- **statusCode**: Sunucu isteği durum kodu (opsiyonel, değer null olabilir)

şeklinde 'key' lere sahip olan bir obje oluşturulur ve promise ile birlikte yollanarak halledilmesi beklenir.

### Hata kodları

Hepsi 700 numarası ile başlayan ve devam eden kodlardır. Kodların anlamları, obje içerisindeki 'message' 'key' i ile açıklanmıştır.

- **700**: 'Invalid date', (Geçersiz tarih)
- **701**: 'Invalid currency code',  (Geçersiz kur kodu)
- **702**: 'Something went wrong on the request', (Sunucu isteğinde bir şeyler yanlış gitti)
- **703**: 'Server respond is not ok. Possibly due to public holiday date', (Sunucu cevabı 'ok' değil. Büyük ihtimalle tatil günü olan bir tarih yüzünden)
- **704**: 'Invalid encoding type', (Geçersiz encoding türü)
- **705**: 'Invalid XML is received', (Geçersiz bir XML alındı)
- **706**: 'Something went wrong while converting XML to JSON', (XML'i JSON'a çevirirken bir şeyler yanlış gitti)
- **707**: 'No such currency or data type found' (Öyle bir kur ya da veri türü bulunamadı)

Neden mi 700'lü numaralar? Nerden bileyim, uydurdum öyle işte. Eğer özel hata kodları üretmek ile alakalı bir standart varsa bunu bana bildirsen aslında süper olur. Aslında var biliyorum, bir defasında bir yerde okumuştum ama hatırlayamadım. Zamanında üniversitede öğrendiğim anlamlı kod kullanımlarını da bu proje için o kadar da gerekli görmedim. Yine de bunu bir konuşabiliriz.

## Dikkat Edilesi Hususlar

- TCMB API'ı, Türkiye'de tatil olan tarihlerde 404 hata kodu ile cevap dönüyor. Hafta sonu da bu şekilde. Şanssız olmanız ve bu şekilde bir tarihi ikinci parametrede argüman olarak kullanmanız durumunda 703 hata kodlu bir hata alacaksınız. Şimdilik bu durum için bir önceki tatil olmayan günün verisini çekip dönme şeklinde bir çözüm uygulamadım. Çünkü Türkiye'de çok fazla tatil olan tarihler var. Eğer bu durumu çözmeye yönelik bir katkıda bulunmak istiyorsanız bana email ile ulaşın, tabi sizden önce halletmezsem.

Not: O anki bulunduğunuz günün verisini çekmeye çalıştığınızda, o gün tatil bile olsa, son iş gününün verisini alıyor olacaksınız.

- 1996 yılından önce hiçbir veri sunulmuyor. Tam olarak söylemek gerekirse, API yalnızca 16 Nisan 1996 ve sonrasındaki tarihler için kullanılabilir.

- Veri türü karakter duyarlı. Yani argüman olarak kullanırken büyük küçük yazımına dikkat etmeniz gerekmekte.

## Bağlı Paketler

- [request](https://www.npmjs.com/package/request): HTTP sunucu istekleri için kullanılıyor.
- [xml2js](https://www.npmjs.com/package/xml2js): XML'i JSON'a çevirmek için kullanılıyor.
- [iconv-lite](https://www.npmjs.com/package/xml2js): Karakter encoding'i için kullanılıyor.

## Geliştirici

- Ali Sabri GÖK - Bana [@alisabrigok](https://twitter.com/alisabrigok) ile Twitter'dan ulaşabilir, email atabilir veya [websitemi](http://www.alisabri.com) ziyaret edebilirsin.

## Katkıda Bulunmak

Tek başına yazılan hiçbir kod tam anlamıyla mükemmel değildir. Şuan belki bu kütüphaneninkiler 'yani' bile olmayabilir. O zaman az laf, çok iş. Öyleyse katkıda bulun ve birlikte düzeltelim, geliştirelim. Açık kaynak kodlu olan şeylerin mantığı da bu zaten.

Açıkcası yazarken baktım ki, başlangıçtaki basit bir kütüphane yazma fikrim geliştirmeye devam ettikçe daha da çok özellik sunabilmek amacıyla plansız bir şekilde büyümeye başlıyor, kodların kalitesizleşmemesi için bu plansızlığa dur deyip kütüphaneyi yayınlama kararı aldım. Proje daha da fazla temizlenip, büyütülebilir. Ama şimdilik bu kadar. Kullanıp beğendiysen ve işine yaradıysa teşekkürler.

## Sonsöz

- Kedilerim Fındık ve Minnak'a teşekkürü bir borç bilirim. Sağolun çocuklar♥. 

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır - detaylar için [LICENSE.md](https://github.com/alisabrigok/tcmb-exchange-rates/blob/master/LICENSE) dosyasına bir göz atın.