/*!
  * digital-gyro v0.1.0
  * (c) 2020 xiaoluoboding
  * @license MIT
  */
import { defineComponent, openBlock, createBlock, Fragment, renderList, toDisplayString, withScopeId, computed, onMounted, onBeforeUpdate, onUpdated, resolveComponent, createVNode, mergeProps } from 'vue';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var numeral = createCommonjsModule(function (module) {
/*! @preserve
 * numeral.js
 * version : 2.0.6
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function (global, factory) {
    if ( module.exports) {
        module.exports = factory();
    } else {
        global.numeral = factory();
    }
}(commonjsGlobal, function () {
    /************************************
        Variables
    ************************************/

    var numeral,
        _,
        VERSION = '2.0.6',
        formats = {},
        locales = {},
        defaults = {
            currentLocale: 'en',
            zeroFormat: null,
            nullFormat: null,
            defaultFormat: '0,0',
            scalePercentBy100: true
        },
        options = {
            currentLocale: defaults.currentLocale,
            zeroFormat: defaults.zeroFormat,
            nullFormat: defaults.nullFormat,
            defaultFormat: defaults.defaultFormat,
            scalePercentBy100: defaults.scalePercentBy100
        };


    /************************************
        Constructors
    ************************************/

    // Numeral prototype object
    function Numeral(input, number) {
        this._input = input;

        this._value = number;
    }

    numeral = function(input) {
        var value,
            kind,
            unformatFunction,
            regexp;

        if (numeral.isNumeral(input)) {
            value = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            value = 0;
        } else if (input === null || _.isNaN(input)) {
            value = null;
        } else if (typeof input === 'string') {
            if (options.zeroFormat && input === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                for (kind in formats) {
                    regexp = typeof formats[kind].regexps.unformat === 'function' ? formats[kind].regexps.unformat() : formats[kind].regexps.unformat;

                    if (regexp && input.match(regexp)) {
                        unformatFunction = formats[kind].unformat;

                        break;
                    }
                }

                unformatFunction = unformatFunction || numeral._.stringToNumber;

                value = unformatFunction(input);
            }
        } else {
            value = Number(input)|| null;
        }

        return new Numeral(input, value);
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function(obj) {
        return obj instanceof Numeral;
    };

    // helper functions
    numeral._ = _ = {
        // formats numbers separators, decimals places, signs, abbreviations
        numberToFormat: function(value, format, roundingFunction) {
            var locale = locales[numeral.options.currentLocale],
                negP = false,
                optDec = false,
                leadingCount = 0,
                abbr = '',
                trillion = 1000000000000,
                billion = 1000000000,
                million = 1000000,
                thousand = 1000,
                decimal = '',
                neg = false,
                abbrForce, // force abbreviation
                abs,
                int,
                precision,
                signed,
                thousands,
                output;

            // make sure we never format a null value
            value = value || 0;

            abs = Math.abs(value);

            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (numeral._.includes(format, '(')) {
                negP = true;
                format = format.replace(/[\(|\)]/g, '');
            } else if (numeral._.includes(format, '+') || numeral._.includes(format, '-')) {
                signed = numeral._.includes(format, '+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
                format = format.replace(/[\+|\-]/g, '');
            }

            // see if abbreviation is wanted
            if (numeral._.includes(format, 'a')) {
                abbrForce = format.match(/a(k|m|b|t)?/);

                abbrForce = abbrForce ? abbrForce[1] : false;

                // check for space before abbreviation
                if (numeral._.includes(format, ' a')) {
                    abbr = ' ';
                }

                format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

                if (abs >= trillion && !abbrForce || abbrForce === 't') {
                    // trillion
                    abbr += locale.abbreviations.trillion;
                    value = value / trillion;
                } else if (abs < trillion && abs >= billion && !abbrForce || abbrForce === 'b') {
                    // billion
                    abbr += locale.abbreviations.billion;
                    value = value / billion;
                } else if (abs < billion && abs >= million && !abbrForce || abbrForce === 'm') {
                    // million
                    abbr += locale.abbreviations.million;
                    value = value / million;
                } else if (abs < million && abs >= thousand && !abbrForce || abbrForce === 'k') {
                    // thousand
                    abbr += locale.abbreviations.thousand;
                    value = value / thousand;
                }
            }

            // check for optional decimals
            if (numeral._.includes(format, '[.]')) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            // break number and format
            int = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');
            leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

            if (precision) {
                if (numeral._.includes(precision, '[')) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    decimal = numeral._.toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    decimal = numeral._.toFixed(value, precision.length, roundingFunction);
                }

                int = decimal.split('.')[0];

                if (numeral._.includes(decimal, '.')) {
                    decimal = locale.delimiters.decimal + decimal.split('.')[1];
                } else {
                    decimal = '';
                }

                if (optDec && Number(decimal.slice(1)) === 0) {
                    decimal = '';
                }
            } else {
                int = numeral._.toFixed(value, 0, roundingFunction);
            }

            // check abbreviation again after rounding
            if (abbr && !abbrForce && Number(int) >= 1000 && abbr !== locale.abbreviations.trillion) {
                int = String(Number(int) / 1000);

                switch (abbr) {
                    case locale.abbreviations.thousand:
                        abbr = locale.abbreviations.million;
                        break;
                    case locale.abbreviations.million:
                        abbr = locale.abbreviations.billion;
                        break;
                    case locale.abbreviations.billion:
                        abbr = locale.abbreviations.trillion;
                        break;
                }
            }


            // format number
            if (numeral._.includes(int, '-')) {
                int = int.slice(1);
                neg = true;
            }

            if (int.length < leadingCount) {
                for (var i = leadingCount - int.length; i > 0; i--) {
                    int = '0' + int;
                }
            }

            if (thousands > -1) {
                int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + locale.delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                int = '';
            }

            output = int + decimal + (abbr ? abbr : '');

            if (negP) {
                output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
            } else {
                if (signed >= 0) {
                    output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
                } else if (neg) {
                    output = '-' + output;
                }
            }

            return output;
        },
        // unformats numbers separators, decimals places, signs, abbreviations
        stringToNumber: function(string) {
            var locale = locales[options.currentLocale],
                stringOriginal = string,
                abbreviations = {
                    thousand: 3,
                    million: 6,
                    billion: 9,
                    trillion: 12
                },
                abbreviation,
                value,
                regexp;

            if (options.zeroFormat && string === options.zeroFormat) {
                value = 0;
            } else if (options.nullFormat && string === options.nullFormat || !string.replace(/[^0-9]+/g, '').length) {
                value = null;
            } else {
                value = 1;

                if (locale.delimiters.decimal !== '.') {
                    string = string.replace(/\./g, '').replace(locale.delimiters.decimal, '.');
                }

                for (abbreviation in abbreviations) {
                    regexp = new RegExp('[^a-zA-Z]' + locale.abbreviations[abbreviation] + '(?:\\)|(\\' + locale.currency.symbol + ')?(?:\\))?)?$');

                    if (stringOriginal.match(regexp)) {
                        value *= Math.pow(10, abbreviations[abbreviation]);
                        break;
                    }
                }

                // check for negative number
                value *= (string.split('-').length + Math.min(string.split('(').length - 1, string.split(')').length - 1)) % 2 ? 1 : -1;

                // remove non numbers
                string = string.replace(/[^0-9\.]+/g, '');

                value *= Number(string);
            }

            return value;
        },
        isNaN: function(value) {
            return typeof value === 'number' && isNaN(value);
        },
        includes: function(string, search) {
            return string.indexOf(search) !== -1;
        },
        insert: function(string, subString, start) {
            return string.slice(0, start) + subString + string.slice(start);
        },
        reduce: function(array, callback /*, initialValue*/) {
            if (this === null) {
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }

            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            var t = Object(array),
                len = t.length >>> 0,
                k = 0,
                value;

            if (arguments.length === 3) {
                value = arguments[2];
            } else {
                while (k < len && !(k in t)) {
                    k++;
                }

                if (k >= len) {
                    throw new TypeError('Reduce of empty array with no initial value');
                }

                value = t[k++];
            }
            for (; k < len; k++) {
                if (k in t) {
                    value = callback(value, t[k], k, t);
                }
            }
            return value;
        },
        /**
         * Computes the multiplier necessary to make x >= 1,
         * effectively eliminating miscalculations caused by
         * finite precision.
         */
        multiplier: function (x) {
            var parts = x.toString().split('.');

            return parts.length < 2 ? 1 : Math.pow(10, parts[1].length);
        },
        /**
         * Given a variable number of arguments, returns the maximum
         * multiplier that must be used to normalize an operation involving
         * all of them.
         */
        correctionFactor: function () {
            var args = Array.prototype.slice.call(arguments);

            return args.reduce(function(accum, next) {
                var mn = _.multiplier(next);
                return accum > mn ? accum : mn;
            }, 1);
        },
        /**
         * Implementation of toFixed() that treats floats more like decimals
         *
         * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
         * problems for accounting- and finance-related software.
         */
        toFixed: function(value, maxDecimals, roundingFunction, optionals) {
            var splitValue = value.toString().split('.'),
                minDecimals = maxDecimals - (optionals || 0),
                boundedPrecision,
                optionalsRegExp,
                power,
                output;

            // Use the smallest precision value possible to avoid errors from floating point representation
            if (splitValue.length === 2) {
              boundedPrecision = Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals);
            } else {
              boundedPrecision = minDecimals;
            }

            power = Math.pow(10, boundedPrecision);

            // Multiply up by precision, round accurately, then divide and use native toFixed():
            output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

            if (optionals > maxDecimals - boundedPrecision) {
                optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
                output = output.replace(optionalsRegExp, '');
            }

            return output;
        }
    };

    // avaliable options
    numeral.options = options;

    // avaliable formats
    numeral.formats = formats;

    // avaliable formats
    numeral.locales = locales;

    // This function sets the current locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    numeral.locale = function(key) {
        if (key) {
            options.currentLocale = key.toLowerCase();
        }

        return options.currentLocale;
    };

    // This function provides access to the loaded locale data.  If
    // no arguments are passed in, it will simply return the current
    // global locale object.
    numeral.localeData = function(key) {
        if (!key) {
            return locales[options.currentLocale];
        }

        key = key.toLowerCase();

        if (!locales[key]) {
            throw new Error('Unknown locale : ' + key);
        }

        return locales[key];
    };

    numeral.reset = function() {
        for (var property in defaults) {
            options[property] = defaults[property];
        }
    };

    numeral.zeroFormat = function(format) {
        options.zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.nullFormat = function (format) {
        options.nullFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function(format) {
        options.defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    numeral.register = function(type, name, format) {
        name = name.toLowerCase();

        if (this[type + 's'][name]) {
            throw new TypeError(name + ' ' + type + ' already registered.');
        }

        this[type + 's'][name] = format;

        return format;
    };


    numeral.validate = function(val, culture) {
        var _decimalSep,
            _thousandSep,
            _currSymbol,
            _valArray,
            _abbrObj,
            _thousandRegEx,
            localeData,
            temp;

        //coerce val to string
        if (typeof val !== 'string') {
            val += '';

            if (console.warn) {
                console.warn('Numeral.js: Value is not string. It has been co-erced to: ', val);
            }
        }

        //trim whitespaces from either sides
        val = val.trim();

        //if val is just digits return true
        if (!!val.match(/^\d+$/)) {
            return true;
        }

        //if val is empty return false
        if (val === '') {
            return false;
        }

        //get the decimal and thousands separator from numeral.localeData
        try {
            //check if the culture is understood by numeral. if not, default it to current locale
            localeData = numeral.localeData(culture);
        } catch (e) {
            localeData = numeral.localeData(numeral.locale());
        }

        //setup the delimiters and currency symbol based on culture/locale
        _currSymbol = localeData.currency.symbol;
        _abbrObj = localeData.abbreviations;
        _decimalSep = localeData.delimiters.decimal;
        if (localeData.delimiters.thousands === '.') {
            _thousandSep = '\\.';
        } else {
            _thousandSep = localeData.delimiters.thousands;
        }

        // validating currency symbol
        temp = val.match(/^[^\d]+/);
        if (temp !== null) {
            val = val.substr(1);
            if (temp[0] !== _currSymbol) {
                return false;
            }
        }

        //validating abbreviation symbol
        temp = val.match(/[^\d]+$/);
        if (temp !== null) {
            val = val.slice(0, -1);
            if (temp[0] !== _abbrObj.thousand && temp[0] !== _abbrObj.million && temp[0] !== _abbrObj.billion && temp[0] !== _abbrObj.trillion) {
                return false;
            }
        }

        _thousandRegEx = new RegExp(_thousandSep + '{2}');

        if (!val.match(/[^\d.,]/g)) {
            _valArray = val.split(_decimalSep);
            if (_valArray.length > 2) {
                return false;
            } else {
                if (_valArray.length < 2) {
                    return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx));
                } else {
                    if (_valArray[0].length === 1) {
                        return ( !! _valArray[0].match(/^\d+$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                    } else {
                        return ( !! _valArray[0].match(/^\d+.*\d$/) && !_valArray[0].match(_thousandRegEx) && !! _valArray[1].match(/^\d+$/));
                    }
                }
            }
        }

        return false;
    };


    /************************************
        Numeral Prototype
    ************************************/

    numeral.fn = Numeral.prototype = {
        clone: function() {
            return numeral(this);
        },
        format: function(inputString, roundingFunction) {
            var value = this._value,
                format = inputString || options.defaultFormat,
                kind,
                output,
                formatFunction;

            // make sure we have a roundingFunction
            roundingFunction = roundingFunction || Math.round;

            // format based on value
            if (value === 0 && options.zeroFormat !== null) {
                output = options.zeroFormat;
            } else if (value === null && options.nullFormat !== null) {
                output = options.nullFormat;
            } else {
                for (kind in formats) {
                    if (format.match(formats[kind].regexps.format)) {
                        formatFunction = formats[kind].format;

                        break;
                    }
                }

                formatFunction = formatFunction || numeral._.numberToFormat;

                output = formatFunction(value, format, roundingFunction);
            }

            return output;
        },
        value: function() {
            return this._value;
        },
        input: function() {
            return this._input;
        },
        set: function(value) {
            this._value = Number(value);

            return this;
        },
        add: function(value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum + Math.round(corrFactor * curr);
            }

            this._value = _.reduce([this._value, value], cback, 0) / corrFactor;

            return this;
        },
        subtract: function(value) {
            var corrFactor = _.correctionFactor.call(null, this._value, value);

            function cback(accum, curr, currI, O) {
                return accum - Math.round(corrFactor * curr);
            }

            this._value = _.reduce([value], cback, Math.round(this._value * corrFactor)) / corrFactor;

            return this;
        },
        multiply: function(value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) * Math.round(curr * corrFactor) / Math.round(corrFactor * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback, 1);

            return this;
        },
        divide: function(value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = _.correctionFactor(accum, curr);
                return Math.round(accum * corrFactor) / Math.round(curr * corrFactor);
            }

            this._value = _.reduce([this._value, value], cback);

            return this;
        },
        difference: function(value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }
    };

    /************************************
        Default Locale && Format
    ************************************/

    numeral.register('locale', 'en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function(number) {
            var b = number % 10;
            return (~~(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    

(function() {
        numeral.register('format', 'bps', {
            regexps: {
                format: /(BPS)/,
                unformat: /(BPS)/
            },
            format: function(value, format, roundingFunction) {
                var space = numeral._.includes(format, ' BPS') ? ' ' : '',
                    output;

                value = value * 10000;

                // check for space before BPS
                format = format.replace(/\s?BPS/, '');

                output = numeral._.numberToFormat(value, format, roundingFunction);

                if (numeral._.includes(output, ')')) {
                    output = output.split('');

                    output.splice(-1, 0, space + 'BPS');

                    output = output.join('');
                } else {
                    output = output + space + 'BPS';
                }

                return output;
            },
            unformat: function(string) {
                return +(numeral._.stringToNumber(string) * 0.0001).toFixed(15);
            }
        });
})();


(function() {
        var decimal = {
            base: 1000,
            suffixes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        },
        binary = {
            base: 1024,
            suffixes: ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
        };

    var allSuffixes =  decimal.suffixes.concat(binary.suffixes.filter(function (item) {
            return decimal.suffixes.indexOf(item) < 0;
        }));
        var unformatRegex = allSuffixes.join('|');
        // Allow support for BPS (http://www.investopedia.com/terms/b/basispoint.asp)
        unformatRegex = '(' + unformatRegex.replace('B', 'B(?!PS)') + ')';

    numeral.register('format', 'bytes', {
        regexps: {
            format: /([0\s]i?b)/,
            unformat: new RegExp(unformatRegex)
        },
        format: function(value, format, roundingFunction) {
            var output,
                bytes = numeral._.includes(format, 'ib') ? binary : decimal,
                suffix = numeral._.includes(format, ' b') || numeral._.includes(format, ' ib') ? ' ' : '',
                power,
                min,
                max;

            // check for space before
            format = format.replace(/\s?i?b/, '');

            for (power = 0; power <= bytes.suffixes.length; power++) {
                min = Math.pow(bytes.base, power);
                max = Math.pow(bytes.base, power + 1);

                if (value === null || value === 0 || value >= min && value < max) {
                    suffix += bytes.suffixes[power];

                    if (min > 0) {
                        value = value / min;
                    }

                    break;
                }
            }

            output = numeral._.numberToFormat(value, format, roundingFunction);

            return output + suffix;
        },
        unformat: function(string) {
            var value = numeral._.stringToNumber(string),
                power,
                bytesMultiplier;

            if (value) {
                for (power = decimal.suffixes.length - 1; power >= 0; power--) {
                    if (numeral._.includes(string, decimal.suffixes[power])) {
                        bytesMultiplier = Math.pow(decimal.base, power);

                        break;
                    }

                    if (numeral._.includes(string, binary.suffixes[power])) {
                        bytesMultiplier = Math.pow(binary.base, power);

                        break;
                    }
                }

                value *= (bytesMultiplier || 1);
            }

            return value;
        }
    });
})();


(function() {
        numeral.register('format', 'currency', {
        regexps: {
            format: /(\$)/
        },
        format: function(value, format, roundingFunction) {
            var locale = numeral.locales[numeral.options.currentLocale],
                symbols = {
                    before: format.match(/^([\+|\-|\(|\s|\$]*)/)[0],
                    after: format.match(/([\+|\-|\)|\s|\$]*)$/)[0]
                },
                output,
                symbol,
                i;

            // strip format of spaces and $
            format = format.replace(/\s?\$\s?/, '');

            // format the number
            output = numeral._.numberToFormat(value, format, roundingFunction);

            // update the before and after based on value
            if (value >= 0) {
                symbols.before = symbols.before.replace(/[\-\(]/, '');
                symbols.after = symbols.after.replace(/[\-\)]/, '');
            } else if (value < 0 && (!numeral._.includes(symbols.before, '-') && !numeral._.includes(symbols.before, '('))) {
                symbols.before = '-' + symbols.before;
            }

            // loop through each before symbol
            for (i = 0; i < symbols.before.length; i++) {
                symbol = symbols.before[i];

                switch (symbol) {
                    case '$':
                        output = numeral._.insert(output, locale.currency.symbol, i);
                        break;
                    case ' ':
                        output = numeral._.insert(output, ' ', i + locale.currency.symbol.length - 1);
                        break;
                }
            }

            // loop through each after symbol
            for (i = symbols.after.length - 1; i >= 0; i--) {
                symbol = symbols.after[i];

                switch (symbol) {
                    case '$':
                        output = i === symbols.after.length - 1 ? output + locale.currency.symbol : numeral._.insert(output, locale.currency.symbol, -(symbols.after.length - (1 + i)));
                        break;
                    case ' ':
                        output = i === symbols.after.length - 1 ? output + ' ' : numeral._.insert(output, ' ', -(symbols.after.length - (1 + i) + locale.currency.symbol.length - 1));
                        break;
                }
            }


            return output;
        }
    });
})();


(function() {
        numeral.register('format', 'exponential', {
        regexps: {
            format: /(e\+|e-)/,
            unformat: /(e\+|e-)/
        },
        format: function(value, format, roundingFunction) {
            var output,
                exponential = typeof value === 'number' && !numeral._.isNaN(value) ? value.toExponential() : '0e+0',
                parts = exponential.split('e');

            format = format.replace(/e[\+|\-]{1}0/, '');

            output = numeral._.numberToFormat(Number(parts[0]), format, roundingFunction);

            return output + 'e' + parts[1];
        },
        unformat: function(string) {
            var parts = numeral._.includes(string, 'e+') ? string.split('e+') : string.split('e-'),
                value = Number(parts[0]),
                power = Number(parts[1]);

            power = numeral._.includes(string, 'e-') ? power *= -1 : power;

            function cback(accum, curr, currI, O) {
                var corrFactor = numeral._.correctionFactor(accum, curr),
                    num = (accum * corrFactor) * (curr * corrFactor) / (corrFactor * corrFactor);
                return num;
            }

            return numeral._.reduce([value, Math.pow(10, power)], cback, 1);
        }
    });
})();


(function() {
        numeral.register('format', 'ordinal', {
        regexps: {
            format: /(o)/
        },
        format: function(value, format, roundingFunction) {
            var locale = numeral.locales[numeral.options.currentLocale],
                output,
                ordinal = numeral._.includes(format, ' o') ? ' ' : '';

            // check for space before
            format = format.replace(/\s?o/, '');

            ordinal += locale.ordinal(value);

            output = numeral._.numberToFormat(value, format, roundingFunction);

            return output + ordinal;
        }
    });
})();


(function() {
        numeral.register('format', 'percentage', {
        regexps: {
            format: /(%)/,
            unformat: /(%)/
        },
        format: function(value, format, roundingFunction) {
            var space = numeral._.includes(format, ' %') ? ' ' : '',
                output;

            if (numeral.options.scalePercentBy100) {
                value = value * 100;
            }

            // check for space before %
            format = format.replace(/\s?\%/, '');

            output = numeral._.numberToFormat(value, format, roundingFunction);

            if (numeral._.includes(output, ')')) {
                output = output.split('');

                output.splice(-1, 0, space + '%');

                output = output.join('');
            } else {
                output = output + space + '%';
            }

            return output;
        },
        unformat: function(string) {
            var number = numeral._.stringToNumber(string);
            if (numeral.options.scalePercentBy100) {
                return number * 0.01;
            }
            return number;
        }
    });
})();


(function() {
        numeral.register('format', 'time', {
        regexps: {
            format: /(:)/,
            unformat: /(:)/
        },
        format: function(value, format, roundingFunction) {
            var hours = Math.floor(value / 60 / 60),
                minutes = Math.floor((value - (hours * 60 * 60)) / 60),
                seconds = Math.round(value - (hours * 60 * 60) - (minutes * 60));

            return hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        },
        unformat: function(string) {
            var timeArray = string.split(':'),
                seconds = 0;

            // turn hours and minutes into seconds and add them all up
            if (timeArray.length === 3) {
                // hours
                seconds = seconds + (Number(timeArray[0]) * 60 * 60);
                // minutes
                seconds = seconds + (Number(timeArray[1]) * 60);
                // seconds
                seconds = seconds + Number(timeArray[2]);
            } else if (timeArray.length === 2) {
                // minutes
                seconds = seconds + (Number(timeArray[0]) * 60);
                // seconds
                seconds = seconds + Number(timeArray[1]);
            }
            return Number(seconds);
        }
    });
})();

return numeral;
}));
});

numeral.register('format', 'zh-number', {
    regexps: {
        format: /(zh)/,
        unformat: /(zh)/
    },
    format: function (value, format) {
        // check if has the space
        const space = numeral._.includes(format, ' zh') ? ' ' : '';
        // check for space before zh
        format = format.replace(/\s?zh/, '');
        const prevFormat = format.split('zh')[0];
        const cnNumberFormat = (val) => {
            if (isNaN(+val))
                return val;
            const symbolMap = [
                { value: 1e8, symbol: '亿' },
                { value: 1e4, symbol: '万' },
                { value: 1e3, symbol: '千' }
            ];
            for (let i = 0; i < symbolMap.length; i++) {
                if (Math.abs(val) >= symbolMap[i].value) {
                    return numeral(val / symbolMap[i].value).format(prevFormat) + space + symbolMap[i].symbol;
                }
            }
            return val.toString();
        };
        return cnNumberFormat(value);
    },
    unformat: function (string) {
        return numeral._.stringToNumber(string) * 0.01;
    }
});

numeral.register('format', 'colonTime', {
    regexps: {
        format: /(HHmmss)/,
        unformat: /(HHmmss)/
    },
    format: function (value, format) {
        // console.log(format)
        return new Date(value).toTimeString().slice(0, 8);
    },
    unformat: function (string) {
        const timeArray = string.split(':');
        let seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        }
        else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }
});

numeral.register('format', 'localDate', {
    regexps: {
        format: /YYYY(\/)MM(\/)DD/,
        unformat: /YYYY(\/)MM(\/)DD/
    },
    format: function (value, format) {
        // console.log(format)
        return new Date(value).toLocaleDateString();
    },
    unformat: function (string) {
        const timeArray = string.split('/');
        let seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        }
        else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }
});

// Linked Node
class Node {
    constructor(element) {
        this.element = element;
        this.next = {};
    }
}
// Linked List
class LinkedList {
    constructor() {
        this.head = new Node('head');
        this.head.next = this.head;
    }
    remove(item) {
        const prevNode = this.findPrevious(item);
        if (!(prevNode.next == null)) {
            prevNode.next = prevNode.next.next;
        }
    }
    findPrevious(item) {
        let currNode = this.head;
        while (!(currNode.next == null) &&
            !(currNode.next.element === 'head') &&
            currNode.next.element !== item) {
            currNode = currNode.next;
        }
        return currNode;
    }
    getCircleMiddle(item) {
        let currNode = this.find(item);
        // console.log(currNode)
        const prevArr = [];
        const nextArr = [];
        for (let i = 0; i < 5; i++) {
            currNode = currNode.next;
            if (currNode.next.element === 'head') {
                currNode = currNode.next.next;
            }
            nextArr.push(currNode.element);
        }
        for (let i = 0; i < 6; i++) {
            prevArr.push(currNode.element);
            currNode = currNode.next;
            if (currNode.next.element === 'head') {
                currNode = currNode.next.next;
            }
        }
        // console.log(JSON.stringify(prevArr))
        // console.log(JSON.stringify(nextArr))
        return prevArr.concat(nextArr);
    }
    display() {
        let currNode = this.head;
        while (!(currNode.next == null) && !(currNode.next.element === 'head')) {
            console.log(currNode.next.element);
            // console.log(currNode.next)
            currNode = currNode.next;
        }
    }
    find(element) {
        let currNode = this.head;
        while (currNode.element !== element) {
            currNode = currNode.next;
        }
        // console.log(currNode)
        return currNode;
    }
    insert(newElement, item) {
        const newNode = new Node(newElement);
        const current = this.find(item);
        if (current) {
            newNode.next = current.next;
            current.next = newNode;
        }
        return this;
    }
}

const easingMap = {
    'Cubic.easeInOut': 'cubic-bezier(0.65, 0, 0.35, 1)',
    'Cubic.easeIn': 'cubic-bezier(0.32, 0, 0.67, 0)',
    'Cubic.easeOut': 'cubic-bezier(0.33, 1, 0.68, 1)',
    'Sine.easeIn': 'cubic-bezier(0.12, 0, 0.39, 0)',
    'Sine.easeOut': 'cubic-bezier(0.61, 1, 0.88, 1)',
    'Sine.easeInOut': 'cubic-bezier(0.37, 0, 0.63, 1)',
    'Quad.easeIn': 'cubic-bezier(0.11, 0, 0.5, 0)',
    'Quad.easeOut': 'cubic-bezier(0.5, 1, 0.89, 1)',
    'Quad.easeInOut': 'cubic-bezier(0.45, 0, 0.55, 1)',
    'Quart.easeIn': 'cubic-bezier(0.5, 0, 0.75, 0)',
    'Quart.easeOut': 'cubic-bezier(0.25, 1, 0.5, 1)',
    'Quart.easeInOut': 'cubic-bezier(0.76, 0, 0.24, 1)',
    'Quint.easeIn': 'cubic-bezier(0.64, 0, 0.78, 0)',
    'Quint.easeOut': 'cubic-bezier(0.22, 1, 0.36, 1)',
    'Quint.easeInOut': 'cubic-bezier(0.83, 0, 0.17, 1)',
    'Expo.easeIn': 'cubic-bezier(0.7, 0, 0.84, 0)',
    'Expo.easeOut': 'cubic-bezier(0.16, 1, 0.3, 1)',
    'Expo.easeInOut': 'cubic-bezier(0.87, 0, 0.13, 1)',
    'Circ.easeIn': 'cubic-bezier(0.55, 0, 1, 0.45)',
    'Circ.easeOut': 'cubic-bezier(0, 0.55, 0.45, 1)',
    'Circ.easeInOut': 'cubic-bezier(0.85, 0, 0.15, 1)',
    'Back.easeIn': 'cubic-bezier(0.36, 0, 0.66, -0.56)',
    'Back.easeOut': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    'Back.easeInOut': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    'Linear': 'linear',
    'Ease': 'ease'
};
const fontSizePreset = {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '4rem'
};
const circleLinkedDigit = new LinkedList();
const UUIDGenerator = () => (String(1e7) + -1e11).replace(/[018]/g, (c) => (Number(c) ^
    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16));
circleLinkedDigit
    .insert('0', 'head')
    .insert('9', '0')
    .insert('8', '9')
    .insert('7', '8')
    .insert('6', '7')
    .insert('5', '6')
    .insert('4', '5')
    .insert('3', '4')
    .insert('2', '3')
    .insert('1', '2')
    .insert('0', '1');

const DIGIT_DEGREE = 360 / 10;
var script = defineComponent({
    name: 'DigitWheel',
    props: {
        value: {
            type: [String, Number],
            default: ''
        },
        index: {
            type: Number,
            default: 0
        },
        size: {
            type: String,
            default: 'base'
        },
        animation: {
            type: String,
            default: 'wheel'
        },
        duration: {
            type: Number,
            default: 1000
        },
        stagger: {
            type: Boolean,
            default: false
        },
        useEase: {
            type: String,
            default: 'Ease'
        },
        isGyro: {
            type: Boolean,
            default: false
        }
    },
    data: vm => ({
        uuid: UUIDGenerator(),
        digitHeight: 0,
        showRange: [vm.value]
    }),
    computed: {
        digitWheel() {
            const digitValue = Number(this.value);
            this.getDigitHeight();
            return new Array(10).fill(0).map((item, index) => {
                const inRadius = (this.digitHeight / 2) / (this.getTanFromDegrees(DIGIT_DEGREE / 2));
                // console.log(this.digitHeight, inRadius)
                const isBackDigit = (digitValue < 5 ? digitValue + 5 : digitValue - 5) === index;
                const isHide = !this.showRange.includes(index);
                return {
                    value: index,
                    style: {
                        transform: `rotateX(${0 - index * DIGIT_DEGREE}deg) translateZ(${inRadius}px)`,
                        visibility: (isBackDigit || isHide) ? 'hidden' : 'visible'
                    }
                };
            });
        },
        digitWheelStyle() {
            const transDuration = `${this.duration + (this.stagger ? 200 : 0) * this.index}ms`;
            const transEaseFunction = easingMap[this.useEase] || 'ease';
            return {
                transform: `rotateX(${Number(this.value) * DIGIT_DEGREE - 360}deg)`,
                transition: `${transDuration} ${transEaseFunction}`
            };
        },
        textStyle() {
            const sizePreset = Object.prototype.hasOwnProperty.call(fontSizePreset, this.size)
                ? fontSizePreset[this.size]
                : this.size;
            return this.isGyro ? {} : { fontSize: sizePreset };
        }
    },
    watch: {
        value(oldVal, newVal) {
            const digits = new Array(10).fill(0).map((item, index) => index);
            const minVal = oldVal < newVal ? oldVal : newVal;
            const maxVal = oldVal < newVal ? newVal : oldVal;
            this.showRange = digits.slice(minVal, maxVal + 1);
        }
    },
    mounted() {
        const dwEl = document.getElementById(this.uuid);
        if (dwEl) {
            const compStyles = window.getComputedStyle(dwEl);
            const digitFontSize = compStyles.getPropertyValue('font-size');
            this.digitHeight = Number(digitFontSize.replace('px', ''));
        }
        this.showRange.push(Number(this.value));
    },
    methods: {
        isNumber(val) {
            return typeof val === 'number' && !isNaN(val);
        },
        isDigit(val) {
            return this.isNumber(parseInt(val, 10));
        },
        getTanFromDegrees(degrees) {
            return Math.tan((degrees * Math.PI) / 180);
        },
        ensureDigitClass(val) {
            const isLetter = /[a-zA-Z]/;
            const isChinese = /[\u4E00-\u9FA5]/;
            const isDigit = /\d/;
            const isPercentage = /%/;
            if (isLetter.test(val))
                return 'is-letter';
            if (isChinese.test(val))
                return 'is-chinese';
            if (isPercentage.test(val))
                return 'is-percentage';
            if (isDigit.test(val))
                return 'is-digit';
            return 'is-symbol';
        },
        getDigitHeight() {
            const dwEl = document.getElementById(this.uuid);
            if (dwEl) {
                const compStyles = window.getComputedStyle(dwEl);
                const digitFontSize = compStyles.getPropertyValue('font-size');
                this.digitHeight = Number(digitFontSize.replace('px', ''));
            }
        }
    }
});

const _withId = /*#__PURE__*/withScopeId("data-v-adefeb32");

const render = /*#__PURE__*/_withId(function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock("div", {
    class: "digit-wheel--wrapper",
    style: _ctx.textStyle
  }, [
    (_ctx.isDigit(_ctx.value))
      ? (openBlock(), createBlock("div", {
          key: 0,
          class: "digit-wheel",
          ref: "digitWheel",
          id: _ctx.uuid,
          style: _ctx.digitWheelStyle,
          "data-digit": _ctx.value
        }, [
          (openBlock(true), createBlock(Fragment, null, renderList(_ctx.digitWheel, (item) => {
            return (openBlock(), createBlock("div", {
              class: "digit is-digit",
              key: item.value,
              "data-digit": item.value,
              style: item.style
            }, toDisplayString(item.value), 13 /* TEXT, STYLE, PROPS */, ["data-digit"]))
          }), 128 /* KEYED_FRAGMENT */))
        ], 12 /* STYLE, PROPS */, ["id", "data-digit"]))
      : (openBlock(), createBlock("div", {
          key: 1,
          class: ["digit", _ctx.ensureDigitClass(_ctx.value)]
        }, toDisplayString(_ctx.value), 3 /* TEXT, CLASS */))
  ], 4 /* STYLE */))
});

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".digit-wheel--wrapper[data-v-adefeb32]{display:inline-block;overflow:hidden}.digit-wheel--wrapper[data-v-adefeb32] .digit-wheel{transform-style:preserve-3d;height:1em;width:1ch}.digit-wheel--wrapper[data-v-adefeb32] .digit{line-height:1}.digit-wheel--wrapper[data-v-adefeb32] .digit.is-digit{position:absolute;top:0;left:0;width:1ch}.digit-wheel--wrapper[data-v-adefeb32] .digit.is-symbol{width:1ch}.digit-wheel--wrapper[data-v-adefeb32] .digit.is-chinese,.digit-wheel--wrapper[data-v-adefeb32] .digit.is-letter,.digit-wheel--wrapper[data-v-adefeb32] .digit.is-percentage{width:1em}";
styleInject(css_248z);

script.render = render;
script.__scopeId = "data-v-adefeb32";
script.__file = "src/packages/DigitWheel.vue";

// const el = ref<HTMLElement | null>(null)
var script$1 = defineComponent({
    name: 'DigitalGyro',
    components: {
        DigitWheel: script
    },
    props: {
        digit: {
            type: Number,
            default: 0
        },
        gutter: {
            type: Number,
            default: 0
        },
        format: {
            type: String,
            default: '0,0'
        },
        size: {
            type: String,
            default: 'base'
        }
    },
    setup(props) {
        const digits = computed(() => {
            let digits = numeral(props.digit).format(props.format);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isEmpty = (val) => val == null || !(Object.keys(val) || val).length;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            digits = Array.from(digits).filter((item) => !isEmpty(item));
            return digits;
        });
        const gyroStyle = computed(() => {
            return {
                // 'grid-template-columns': `repeat(${digits.value.length}, minmax(0, 1fr))`,
                padding: `0 ${props.gutter}px`
            };
        });
        const textStyle = computed(() => {
            const sizePreset = Object.prototype.hasOwnProperty.call(fontSizePreset, props.size)
                ? fontSizePreset[props.size]
                : props.size;
            return {
                fontSize: sizePreset
            };
        });
        onMounted(() => {
            // console.log(props)
        });
        onBeforeUpdate(() => {
            // isUpdated.value = false
        });
        onUpdated(() => {
            // isUpdated.value = true
        });
        return {
            digits,
            gyroStyle,
            textStyle
        };
    }
});

const _withId$1 = /*#__PURE__*/withScopeId("data-v-57331f7e");

const render$1 = /*#__PURE__*/_withId$1(function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_DigitWheel = resolveComponent("DigitWheel");

  return (openBlock(), createBlock("div", {
    class: "digital-gyro",
    style: _ctx.textStyle
  }, [
    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.digits, (digit, index) => {
      return (openBlock(), createBlock("div", {
        class: "digital-gyro__col",
        style: _ctx.gyroStyle,
        key: index
      }, [
        createVNode(_component_DigitWheel, mergeProps({
          "is-gyro": "",
          value: digit,
          index: index,
          size: _ctx.size
        }, _ctx.$attrs), null, 16 /* FULL_PROPS */, ["value", "index", "size"])
      ], 4 /* STYLE */))
    }), 128 /* KEYED_FRAGMENT */))
  ], 4 /* STYLE */))
});

var css_248z$1 = ".digital-gyro[data-v-57331f7e]{height:1em}.digital-gyro__col[data-v-57331f7e]{display:inline-block}.digital-gyro__col[data-v-57331f7e]:first-child{padding-left:0!important}.digital-gyro__col[data-v-57331f7e]:last-child{padding-right:0!important}";
styleInject(css_248z$1);

script$1.render = render$1;
script$1.__scopeId = "data-v-57331f7e";
script$1.__file = "src/packages/DigitalGyro.vue";

// const CENTER_DIGIT = -5
let timer = 0;
// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const directive = {
    mounted: (el, binding) => {
        const { value } = binding;
        if (value) {
            el.classList.add(`slide-offset-5`);
            el.setAttribute('data-digit', value);
        }
    },
    beforeUpdate: (el, binding) => {
        const { oldValue } = binding;
        // const newDigit = Math.abs(Math.abs(Number(value) - Number(oldValue)) + CENTER_DIGIT)
        if (oldValue !== null) {
            if (timer)
                clearTimeout(timer);
            el.classList.remove(`is-digit`);
            el.classList.remove(`slide-offset-5`);
            el.style.transition = '';
            // el.classList.add(`slide-offset-${newDigit}`)
        }
    },
    updated: (el, binding) => {
        // console.log(binding.value.value)
        // console.log(binding.value.transition)
        const { oldValue, value } = binding;
        // const newDigit = Math.abs(Math.abs(Number(value) - Number(oldValue)) + CENTER_DIGIT)
        if (oldValue !== null) {
            timer = setTimeout(() => {
                el.classList.add(`is-digit`);
                el.classList.add(`slide-offset-5`);
                // el.classList.remove(`slide-offset-${newDigit}`)
                el.style.transition = value.transition;
            }, 17);
        }
        if (value) {
            el.setAttribute('data-digit', value.value);
        }
    }
};
const isVue3 = (app) => app.version[0] === '3';
const Plugin = (app, directives = 'variantwind') => {
    if (isVue3(app)) {
        if (Array.isArray(directives)) {
            directives.map(name => {
                app.directive(name, directive);
            });
        }
        else {
            app.directive(directives, directive);
        }
    }
};

const install = (app) => {
    app.component(script$1.name, script$1);
    app.component(script.name, script);
    app.use(Plugin, 'slide');
};

export default install;
export { script as DigitWheel, script$1 as DigitalGyro, install };