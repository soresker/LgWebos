let WTools = {

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
    }

}
