function Publisher() {

    this.playerGlobalData = "";
    this.publishData ="";
    this.videoType = 0;
    this.currencyValues = "";

}
Publisher.prototype.newPublishment =  function(publishmentData) {
    
    try {

        if (Tools.isObject(publishmentData)) 
        {
            console.log("publishmentData isObject");
            this.publishData = publishmentData;

        } else {
            this.publishData = JSON.parse(publishmentData);
            //console.log ("Publisher JSON publishmentData :"+this.publishData,"");
        }

    } catch (exception) {

        console.log("error : ", exception);

    }
    //Publishment ile neler yapacağız..

    Publishment_Reader.parseLatestPublishment(this.publishData);
}

Publisher.prototype.setGlobalData = function(data) {
        this.playerGlobalData = JSON.parse(data).filePath;
        this.videoType = JSON.parse(data).videoMode;
        console.log("JSON.parse(data).videoMode:",this.videoType);
    }

Publisher.prototype.setCurrencyData = function(data) {
        this.currencyValues = {usd:JSON.parse(data).usd,
                               euro:JSON.parse(data).euro}
        console.log("setCurrencyData:",this.currencyValues);
    }



