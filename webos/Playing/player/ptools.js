class  Tools  {

    static defaultValue = function(value, defaultValue) {

        return "undefined" == typeof value ? defaultValue : value;

    }

    static replaceAll = function(targetString, search, replacement) {
        return targetString.replace(new RegExp(search, 'g'), replacement);

    }

    static guid = function() {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

    } 

    static isObject = function(obj) {
        return obj !== undefined && obj !== null && obj.constructor == Object;
    }


    static getDecodedString = function(stringValue) {
        stringValue = Tools.replaceAll(stringValue, "&amp;", "&");
        stringValue = Tools.replaceAll(stringValue, "&lt;", "<");
        stringValue = Tools.replaceAll(stringValue, "&gt;", ">");
        stringValue = Tools.replaceAll(stringValue, "&#xD;", "");
        stringValue = Tools.replaceAll(stringValue, "&#xA;", " ");
        stringValue = Tools.replaceAll(stringValue, "\r", "");
        stringValue = Tools.replaceAll(stringValue, "\n", " ");
        stringValue = Tools.replaceAll(stringValue, "&quot;", "\"");
        stringValue = Tools.replaceAll(stringValue, "&apos;", "'");

        return stringValue;

    }
    static  htmlEncode =  function(value) {
        return $('<div/>').text(value).html();
    }

    static htmlDecode =  function(value) {
        return $('<div/>').html(value).text();
    }

    static isEmptyString = function(value) {

        if (value == null || value == undefined)
            return true;
        value = value.trim();
        return !(value.length > 0);
    } 

    static replaceTRCharacters = function(value) {
        let string = value.toUpperCase();
        let letters = { "İ": "I", "Ş": "S", "Ğ": "G", "Ü": "U", "Ö": "O", "Ç": "C" };
        string = string.replace(/(([İŞĞÜÇÖ]))/g, function(letter) { return letters[letter]; })
        return string;
    }

    static isEmptyObject =  function(obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    static showImage = function() {
        console.log("showImage:" ,'Info');
        $('#player-image').show();
        console.log("showImage End" ,'Info');
    } 
    static hideImage =  function() {
        $('#player-image').hide();
    } 
    static getDateTimeNow = function() {
        return moment();
    }

}

if (typeof module !== 'undefined') module.exports = { Tools };
