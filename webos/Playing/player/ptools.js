function  Tools()  {

    Tools.prototype.defaultValue = function(value, defaultValue) {

        return "undefined" == typeof value ? defaultValue : value;

    }

    Tools.prototype.replaceAll = function(targetString, search, replacement) {
        return targetString.replace(new RegExp(search, 'g'), replacement);

    }

    Tools.prototype.guid = function() {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

    } 

    Tools.prototype.isObject = function(obj) {
        return obj !== undefined && obj !== null && obj.constructor == Object;
    }


    Tools.prototype.getDecodedString = function(stringValue) {
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
    Tools.prototype.htmlEncode =  function(value) {
        return $('<div/>').text(value).html();
    }

    Tools.prototype.htmlDecode =  function(value) {
        return $('<div/>').html(value).text();
    }

    Tools.prototype.isEmptyString = function(value) {

        if (value == null || value == undefined)
            return true;
        value = value.trim();
        return !(value.length > 0);
    } 

    Tools.prototype.replaceTRCharacters = function(value) {
        var string = value.toUpperCase();
        var letters = { "İ": "I", "Ş": "S", "Ğ": "G", "Ü": "U", "Ö": "O", "Ç": "C" };
        string = string.replace(/(([İŞĞÜÇÖ]))/g, function(letter) { return letters[letter]; })
        return string;
    }

    Tools.prototype.isEmptyObject =  function(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    Tools.prototype.showImage = function() {
        console.log("showImage:" ,'Info');
        $('#player-image').show();
        console.log("showImage End" ,'Info');
    } 
    Tools.prototype.hideImage =  function() {
        $('#player-image').hide();
    } 
    Tools.prototype.getDateTimeNow = function() {
        return moment();
    }

}
