/* eslint-disable */
const filters = Vue => {
    Vue.filter('YY_MM_DD_HH_MM_SS', function(date, format = 'yyyy-MM-dd HH:mm:ss') {
        date = new Date(date);
        if (format === 'date') {
            format = 'yyyy-MM-dd';
        }
        if (format === 'short') {
            format = 'M/d/yy h:mm';
        }
        if (format === 'medium') {
            format = 'MM d, y h:mm:ss';
        }
        let padNumber = function(num, digits, trim, negWrap) {
            let neg = '';
            if (num < 0 || (negWrap && num <= 0)) {
                if (negWrap) {
                    num = -num + 1;
                } else {
                    num = -num;
                    neg = '-';
                }
            }
            num = '' + num;
            while (num.length < digits) {
                num = '0' + num;
            }
            if (trim) {
                num = num.substr(num.length - digits);
            }
            return neg + num;
        };
        let dateGetter = function(name, size, offset, trim, negWrap) {
            offset = offset || 0;
            return function(date) {
                var value = date['get' + name]();
                if (offset > 0 || value > -offset) {
                    value += offset;
                }
                if (value === 0 && offset === -12) {
                    value = 12;
                }
                return padNumber(value, size, trim, negWrap);
            };
        };
        let DATE_FORMATS = {
            yyyy: dateGetter('FullYear', 4, 0, false, true),
            yy: dateGetter('FullYear', 2, 0, true, true),
            y: dateGetter('FullYear', 1, 0, false, true),
            MM: dateGetter('Month', 2, 1),
            M: dateGetter('Month', 1, 1),
            dd: dateGetter('Date', 2),
            d: dateGetter('Date', 1),
            HH: dateGetter('Hours', 2),
            H: dateGetter('Hours', 1),
            hh: dateGetter('Hours', 2, -12),
            h: dateGetter('Hours', 1, -12),
            mm: dateGetter('Minutes', 2),
            m: dateGetter('Minutes', 1),
            ss: dateGetter('Seconds', 2),
            s: dateGetter('Seconds', 1),
            sss: dateGetter('Milliseconds', 3)
        };
        var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))([\s\S]*)/;
        let text = '',
            fn,
            match,
            parts = [];
        while (format) {
            match = DATE_FORMATS_SPLIT.exec(format);
            if (match) {
                parts = parts.concat([].slice.call(match, 1));
                format = parts.pop();
            } else {
                parts.push(format);
                format = null;
            }
        }
        parts.forEach(function(value) {
            fn = DATE_FORMATS[value];
            text += fn ? fn(date) : value === "''" ? "'" : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
        });
        return text;
    });
};

export default filters;
