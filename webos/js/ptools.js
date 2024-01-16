let Tools = {

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

    },
    getDateTimeNow : function() {
        return moment();
    }

}
