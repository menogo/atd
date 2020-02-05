/* eslint-disable */
var class2type = {};
var toString = class2type.toString;
var emptyArray = [],
    slice = emptyArray.slice,
    filter = emptyArray.filter;
var $ = {
    format: function(tpl, metaData, filter, rules) {
        var data = [],
            reg = null,
            rules = rules || {},
            tmp_str,
            tmp_tpl;
        if (tpl && metaData) {
            if ($.isPlainObject(metaData)) {
                metaData = [metaData];
            }
            if ($.isArray(metaData)) {
                $.each(metaData, function(k, v) {
                    if (!filter || filter(v, k, metaData)) {
                        tmp_str = tpl;
                        tmp_tpl = tpl;
                        $.each(v, function(m, n) {
                            n = rules[m] && $.isFunction(rules[m]) ? rules[m].call(v, n, m, k, metaData) : n;
                            reg = new RegExp('\\$\\!?\\{' + m + '\\}', 'gm');
                            try {
                                tmp_str = tmp_tpl = tmp_tpl.replace(reg, decodeURIComponent(n));
                            } catch (e) {
                                tmp_str = tmp_tpl = tmp_tpl.replace(reg, n);
                            }
                        });
                        data.push(tmp_str);
                    }
                });
                tmp_str = data.join('');
                reg = new RegExp('\\$\\!\\{[^\\{\\}]+\\}', 'gm');
                return tmp_str.replace(reg, '');
            } else {
                return '';
            }
        } else {
            return '';
        }
    },
    parseJSON: function(data) {
        if (!data || typeof data != 'string') {
            return data;
        }
        data = data.trim();
        try {
            data = JSON.parse(data);
        } catch (e) {
            data = new Function('return ' + data)();
        }
        return data;
    },
    getCookie: function(name) {
        var re = new RegExp('(?:^|;+|\\s+)' + name + '=([^;]*)');
        var result = document.cookie.match(re);
        return !result ? '' : result[1];
    },
    setCookie: function(name, value, domain, path, minute) {
        if (minute) {
            var now = new Date(),
                expire = new Date();
            expire.setTime(parseFloat(+now) + 60 * 1000 * minute);
        }
        document.cookie =
            name +
            '=' +
            value +
            '; ' +
            (minute ? 'expires=' + expire.toUTCString() + '; ' : '') +
            ('path=' + (path || '/') + '; domain=' + (domain || 'tenpay.com') + ';');
    },
    deleteCookie: function(name, domain, path) {
        document.cookie =
            name +
            '=; expires=Mon, 2 Mar 2009 19:00:00 UTC; path=' +
            (path || '/') +
            '; domain=' +
            (domain || 'tenpay.com') +
            ';';
    },
    getParameter: function(name, param, unfilter, undecode) {
        var obj = {},
            tmp,
            str = typeof param == 'string' ? param : location.search.replace('?', '');
        var arr = str.split('&');
        if (arr.length > 0) {
            for (var i = 0, l = arr.length; i < l; i++) {
                try {
                    if (/(.*?)=(.*)/.test(arr[i])) {
                        tmp = undecode ? RegExp.$2 : decodeURIComponent(RegExp.$2);
                        obj[RegExp.$1] = unfilter ? tmp : this.filterScript(tmp);
                    }
                } catch (e) {}
            }
        }
        return name ? obj[name] : obj;
    },
    filterScript: function(str) {
        var text = document.createTextNode(str),
            parser = document.createElement('div'),
            value = '';
        parser.appendChild(text);
        value = parser.innerHTML;
        text = null;
        parser = null;
        return value;
    }
};
function type(obj) {
    return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
}
function isWindow(obj) {
    return obj != null && obj == obj.window;
}
function isFunction(value) {
    return type(value) == 'function';
}
function isArray(value) {
    return value instanceof Array;
}
function isBoolean(value) {
    return type(value) == 'boolean';
}
function likeArray(obj) {
    return typeof obj.length == 'number';
}
function isObject(obj) {
    return type(obj) == 'object';
}
function isString(obj) {
    return typeof obj == 'string';
}
function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}
var uniq = function(array) {
    return filter.call(array, function(item, idx) {
        return array.indexOf(item) == idx;
    });
};
$.isArray = isArray;
$.isPlainObject = isPlainObject;
$.isFunction = isFunction;
$.isBoolean = isBoolean;
$.isString = isString;
$.type = type;
$.isObject = isObject;
$.uniq = uniq;
function extend(target, source, deep) {
    for (var key in source)
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
            if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
            extend(target[key], source[key], deep);
        } else if (source[key] !== undefined) target[key] = source[key];
}
$.each = function(elements, callback) {
    var i, key;
    if (likeArray(elements)) {
        for (i = 0; i < elements.length; i++) if (callback.call(elements[i], i, elements[i]) === false) return elements;
    } else {
        for (key in elements) if (callback.call(elements[key], key, elements[key]) === false) return elements;
    }
    return elements;
};
$.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function(i, name) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
});
function serialize(params, obj, traditional, scope) {
    var type,
        array = $.isArray(obj),
        hash = $.isPlainObject(obj);
    $.each(obj, function(key, value) {
        type = $.type(value);
        if (scope)
            key = traditional ? scope : scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
        if (!scope && array) params.add(value.name, value.value);
        else if (type == 'array' || (!traditional && type == 'object')) serialize(params, value, traditional, key);
        else params.add(key, value);
    });
}
$.param = function(obj, traditional) {
    var params = [];
    params.add = function(k, v) {
        this.push(escape(k) + '=' + escape(v));
    };
    serialize(params, obj, traditional);
    return params.join('&').replace(/%20/g, '+');
};
$.extend = function(target) {
    var deep,
        args = slice.call(arguments, 1);
    if (typeof target == 'boolean') {
        deep = target;
        target = args.shift();
    }
    args.forEach(function(arg) {
        extend(target, arg, deep);
    });
    return target;
};
var checkStorage = function(o) {
    var key = 'STOARGE_TEST',
        value;
    try {
        o.setItem(key, 1);
        value = o.getItem(key);
        o.removeItem(key);
        return value == 1;
    } catch (e) {
        return false;
    }
};
try {
    var isSessionAble = checkStorage(sessionStorage);
    var isLocalAble = checkStorage(localStorage);
} catch (e) {
    var isSessionAble = false;
    var isLocalAble = false;
}
$.isCookieAble = (function() {
    var key = 'cookie_test',
        v;
    $.setCookie(key, '1');
    v = $.getCookie(key);
    $.deleteCookie(key);
    return v == '1' && navigator.cookieEnabled;
})();
var storage = (function() {
    var MAX_TRY = 100;
    var count = 0;
    var STORAGE_KEY = 'TENPAY_STORAGE_CACHE';
    var cacheS = isSessionAble ? $.parseJSON(sessionStorage.getItem(STORAGE_KEY) || '{}') : {};
    var cacheL = isLocalAble ? $.parseJSON(localStorage.getItem(STORAGE_KEY) || '{}') : {};
    var _setItem = function(key, value, persistence) {
        count = MAX_TRY;
        if (persistence) {
            cacheL[key] = {
                v: value,
                t: +new Date()
            };
            _flush(persistence);
        } else {
            cacheS[key] = {
                v: value,
                t: +new Date()
            };
            _flush(persistence);
        }
    };
    var _getItem = function(key, persistence) {
        var o = persistence ? cacheL[key] : cacheS[key];
        var v = o && o.v;
        return isPlainObject(v) ? $.extend({}, v) : Array.isArray(v) ? $.extend([], v) : v;
    };
    var _removeItem = function(key, persistence) {
        count = MAX_TRY;
        persistence ? delete cacheL[key] : delete cacheS[key];
        _flush(persistence);
    };
    var _flush = function(persistence) {
        var o;
        try {
            o = persistence ? JSON.stringify(cacheL) : JSON.stringify(cacheS);
        } catch (e) {
            throw new Error('JSON数据格式异常\uFF1A' + e.message);
        }
        try {
            if (persistence) {
                isLocalAble && localStorage.setItem(STORAGE_KEY, o);
            } else {
                isSessionAble && sessionStorage.setItem(STORAGE_KEY, o);
            }
        } catch (e) {
            count--;
            if (count >= 0) {
                _shiftByTime(persistence);
                _flush(persistence);
            } else {
                throw new Error('写入缓存异常\uFF1A' + e.message);
            }
        }
    };
    var _shiftByTime = function(persistence) {
        var tar = persistence ? cacheL : cacheS;
        var old;
        for (var k in tar) {
            var v = tar[key];
            if (old) {
                old = old.t > v.t ? v : old;
            } else {
                old = v;
            }
        }
        old && delete tar[old.id];
    };
    return {
        setItem: _setItem,
        getItem: _getItem,
        removeItem: _removeItem
    };
})();
var sessionCache = {
    getWindow: function() {
        try {
            return $.parseJSON(window.name || '{}');
        } catch (e) {
            return {};
        }
    },
    setWindow: function(data) {
        data && (window.name = JSON.stringify(data));
    },
    getItem: function(key, force) {
        if (isSessionAble && !force) {
            return storage.getItem(key, false);
        } else {
            var data = this.getWindow();
            if (isPlainObject(data)) {
                return data[key];
            }
        }
    },
    setItem: function(key, value, merge, force) {
        if (merge && isPlainObject(value) && isPlainObject(this.getItem(key))) {
            value = $.extend(this.getItem(key), value);
        }
        if (isSessionAble && !force) {
            storage.setItem(key, value, false);
        } else {
            var data = this.getWindow();
            if (!isPlainObject(data)) {
                data = {};
            }
            data[key] = value;
            this.setWindow(data);
        }
    },
    removeItem: function(key, force) {
        if (isSessionAble && !force) {
            storage.removeItem(key, false);
        } else {
            var data = this.getWindow();
            if (isPlainObject(data)) {
                delete data[key];
                this.setWindow(data);
            }
        }
    }
};
$.sessionCache = sessionCache;
$.storage = storage;
var _Rebuild = {
    route: function(config, data, status, xhr) {
        var type = this.getFileType(config.url);
        this[type] && this[type].apply(this, arguments);
    },
    js: function(config, data, status, xhr) {
        (config.parent ? config.parent : this.getHeadElement()).append(
            $(
                "<script type='text/javascript'" +
                    (config.id ? " id='" + config.id + "'" : '') +
                    '>' +
                    data +
                    '</script>'
            )
        );
    },
    css: function(config, data, status, xhr) {
        (config.parent ? config.parent : this.getHeadElement()).append(
            $("<style type='text/css'" + (config.id ? " id='" + config.id + "'" : '') + '>' + data + '</style>')
        );
    },
    html: function(config, data, status, xhr) {
        _Res_cache.setContent(config, this.getHtmlData(data));
    },
    insertRes: function(v) {
        var type = this.getFileType(v);
        if (type == 'css') {
            this.getHeadElement().append(
                $("<link rel='stylesheet' type='text/css' charset='utf-8' href='" + v + "' />")
            );
        }
    },
    removeElement: function(item) {
        $('#' + item.id).remove();
    },
    getFileType: function(url) {
        var type = (url || '').match(/\.+(\w+)$/)[1];
        return type === 'shtml' ? 'html' : type;
    },
    getHeadElement: function() {
        return $($('head')[0] || document.documentElement);
    },
    getHtmlData: function(str) {
        return [
            this.analyse(str, 'VERSION-START', 'VERSION-END'),
            this.analyse(str, 'PAGE-START', 'PAGE-END'),
            this.analyse(str, 'SCRIPT-START', 'SCRIPT-END')
        ];
    },
    analyse: function(data, start, end) {
        var stack = [],
            p1 = new RegExp('(<!--\\[' + start + '\\]-->)'),
            p2 = new RegExp('(<!--\\[' + end + '\\]-->)'),
            r1 = null,
            r2 = null,
            s = null != (r1 = p1.exec(data)) ? r1[1] : '',
            e = null != (r2 = p2.exec(data)) ? r2[1] : '',
            sl = s.length,
            el = e.length,
            content = '';
        if (sl > 0 && el > 0) {
            stack.push('<!--[' + start + ']-->');
            content = data.substring(data.indexOf(s) + sl, data.indexOf(e));
            stack.push(content);
            stack.push('<!--[' + end + ']-->');
            content = stack.join('');
        } else {
            content = '';
        }
        p1 = null;
        p2 = null;
        r1 = null;
        r2 = null;
        s = null;
        e = null;
        sl = 0;
        el = 0;
        stack = null;
        return content;
    }
};
$.Rebuild = _Rebuild;
(function($) {
    function detect(ua) {
        var os = (this.os = $.os = {}),
            browser = (this.browser = $.browser = {}),
            webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
            android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
            playbook = ua.match(/PlayBook/),
            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
            firefox = ua.match(/Firefox\/([\d.]+)/),
            ie = ua.match(/MSIE ([\d.]+)/),
            safari = webkit && ua.match(/Mobile\//) && !chrome,
            webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome,
            ie = ua.match(/MSIE\s([\d.]+)/);
        if ((browser.webkit = !!webkit)) browser.version = webkit[1];
        if (android) (os.android = true), (os.version = android[2]);
        if (iphone && !ipod) (os.ios = os.iphone = true), (os.version = iphone[2].replace(/_/g, '.'));
        if (ipad) (os.ios = os.ipad = true), (os.version = ipad[2].replace(/_/g, '.'));
        if (ipod) (os.ios = os.ipod = true), (os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null);
        if (webos) (os.webos = true), (os.version = webos[2]);
        if (touchpad) os.touchpad = true;
        if (blackberry) (os.blackberry = true), (os.version = blackberry[2]);
        if (bb10) (os.bb10 = true), (os.version = bb10[2]);
        if (rimtabletos) (os.rimtabletos = true), (os.version = rimtabletos[2]);
        if (playbook) browser.playbook = true;
        if (kindle) (os.kindle = true), (os.version = kindle[1]);
        if (silk) (browser.silk = true), (browser.version = silk[1]);
        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
        if (chrome) (browser.chrome = true), (browser.version = chrome[1]);
        if (firefox) (browser.firefox = true), (browser.version = firefox[1]);
        if (ie) (browser.ie = true), (browser.version = ie[1]);
        if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true;
        if (webview) browser.webview = true;
        if (ie) (browser.ie = true), (browser.version = ie[1]);
        os.tablet = !!(
            ipad ||
            playbook ||
            (android && !ua.match(/Mobile/)) ||
            (firefox && ua.match(/Tablet/)) ||
            (ie && !ua.match(/Phone/) && ua.match(/Touch/))
        );
        os.phone = !!(
            !os.tablet &&
            !os.ipod &&
            (android ||
                iphone ||
                webos ||
                blackberry ||
                bb10 ||
                (chrome && ua.match(/Android/)) ||
                (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
                (firefox && ua.match(/Mobile/)) ||
                (ie && ua.match(/Touch/)))
        );
    }
    detect.call($, navigator.userAgent);
    $.__detect = detect;
})($);
export default $;
