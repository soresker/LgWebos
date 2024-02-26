var WTools = {

     defaultValue : function(value, defaultValue) {

        return "undefined" == typeof value ? defaultValue : value;

    },

    replaceAll : function(targetString, search, replacement) {
        return targetString.replace(new RegExp(search, 'g'), replacement);

    },

    guid : function() {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

    },

    isObject : function(obj) {
        return obj !== undefined && obj !== null && obj.constructor == Object;
    },


    getDecodedString : function(stringValue) {
        stringValue = WTools.replaceAll(stringValue, "&amp;", "&");
        stringValue = WTools.replaceAll(stringValue, "&lt;", "<");
        stringValue = WTools.replaceAll(stringValue, "&gt;", ">");
        stringValue = WTools.replaceAll(stringValue, "&#xD;", "");
        stringValue = WTools.replaceAll(stringValue, "&#xA;", " ");
        stringValue = WTools.replaceAll(stringValue, "\r", "");
        stringValue = WTools.replaceAll(stringValue, "\n", " ");
        stringValue = WTools.replaceAll(stringValue, "&quot;", "\"");
        stringValue = WTools.replaceAll(stringValue, "&apos;", "'");

        return stringValue;

    },
    getDateTimeNow : function() {
        return moment();
    },

    showUI: function () {

        Logger.sendMessage('showUI');

    },
    removeUI: function () {

        Logger.sendMessage('removeUI');

    },

    moveUp: function () {

        Logger.sendMessage('moveUp');

    },
    moveDown: function () {
   
        Logger.sendMessage('moveDown');

    },
    moveLeft: function () {

        Logger.sendMessage('moveLeft');

    },
    moveRight: function () {

        Logger.sendMessage('moveRight');

    },
    submit: function () {

        Logger.sendMessage('submit');

    },

    cancel: function () {

        Logger.sendMessage('cancel');

    },
    keyCodeToValue : function (keyCode) {

        var value = "0";
    
        switch (keyCode) {
    
            case 49: value = "1"; break;
            case 50: value = "2"; break;
            case 51: value = "3"; break;
            case 52: value = "4"; break;
            case 53: value = "5"; break;
            case 54: value = "6"; break;
            case 55: value = "7"; break;
            case 56: value = "8"; break;
            case 57: value = "9"; break
            case 48: value = "0"; break
            case 461: value = "[Back]"; break
            case 13: value = "[Enter]"; break;
            case 38: value = "[Up]"; break;
            case 40: value = "[Down]"; break;
            case 37: value = "[Left]"; break;
            case 39: value = "[Right]"; break;
    
            default: value = "0";
        }
    
        return value;
    
    }

}
