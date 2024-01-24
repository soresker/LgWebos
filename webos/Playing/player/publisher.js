function Publisher() {}

Publisher.playerGlobalData = "";
Publisher.publishData = "";
Publisher.videoType = 0;
Publisher.currencyValues = "";

Publisher.newPublishment = function (publishmentData) {
    try {
        if (Tools.isObject(publishmentData)) {
            console.log("publishmentData isObject");
            Publisher.publishData = publishmentData;
        } else {
            Publisher.publishData = JSON.parse(publishmentData);
            //console.log ("Publisher JSON publishmentData :"+this.publishData,"");
        }
    } catch (exception) {
        console.log("error : ", exception);
    }
    //Publishment ile neler yapacağız..
    Publishment_Reader.parseLatestPublishment(Publisher.publishData);
};

Publisher.setGlobalData = function (data) {
    Publisher.playerGlobalData = JSON.parse(data).filePath;
    Publisher.videoType = JSON.parse(data).videoMode;
    console.log("JSON.parse(data).videoMode:", Publisher.videoType);
};

Publisher.setCurrencyData = function (data) {
    Publisher.currencyValues = {
        usd: JSON.parse(data).usd,
        euro: JSON.parse(data).euro,
    };
    console.log("setCurrencyData:", Publisher.currencyValues);
};
