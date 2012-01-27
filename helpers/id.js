/*
 *  Original code Kevin van Zonneveld <kevin@vanzonneveld.net>
 *  Code Base on Even Simon <even.simon@gmail.com>
 *  http://kevin.vanzonneveld.net/techblog/article/create_short_ids_with_php_like_youtube_or_tinyurl/
 */

var base = 'bcdfghjklmnpqrstvwxyz0123456789BCDFGHJKLMNPQRSTVWXYZ';

var bcpow = function(a, b){
    return Math.floor(Math.pow(parseFloat(a), parseInt(b)));
};

exports.encode = function(id) {
    if (typeof id == 'undefined') {
        return null;
    } else if (typeof(id) != 'number') {
        throw new Error('Wrong parameter type');
    }
    
    var r = '';
    for(var i = Math.floor(Math.log(parseInt(id))/Math.log(base.length)); i >= 0; i--) {
        r = r + base.substr((Math.floor(parseInt(id) / bcpow(base.length, i)) % base.length),1);
    }
    
    return r.split('').reverse().join('');
};
exports.decode = function(str) {
    if (typeof str == 'undefined') {
        return null;
    } else if (typeof(str) != 'string') {
        throw new Error('Wrong parameter type');
    }
    
    var s = str.split('').reverse().join('');
    var r = 0;
    for(var i = 0; i <= (str.length - 1); i++) {
        r = r + base.indexOf(s.substr(i, 1)) * (bcpow(base.length, (s.length - 1) - i));
    }
    
    return r;
};