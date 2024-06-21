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
    Publishment_Reader.startTemplateCheck();
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

Publisher.startTemplateCheck() {
    setInterval(function() {
        Publisher.checkTemplates();
    }, 10000); // 10 saniyede bir çalışır
}

Publisher.checkTemplates() {
    var now = moment();
    var templateChanged = false;

    console.log("checkTemplates called at: ", now.format());

    var alternativeActive = false;
    for (var i = 0; i < Publishment_Reader.currentPublishment.calendar.templates.length; i++) {
        var template = Publishment_Reader.currentPublishment.calendar.templates[i];
        var startTime = moment(template.startTime, "HH:mm:ss");
        var endTime = moment(template.endTime, "HH:mm:ss");

        if (template.typeOf === 'alternative' && now.isBetween(startTime, endTime)) {
            alternativeActive = true;
            for (var j = 0; j < Publishment_Reader.currentPublishment.templates.length; j++) {
                var currentTemplate = Publishment_Reader.currentPublishment.templates[j];
                if (currentTemplate.templateUniqId === template.templateUniqId) {
                    if (!currentTemplate.isActive) {
                        currentTemplate.isActive = true;
                        templateChanged = true;
                        console.log('Template ' + currentTemplate.templateUniqId + ' activated.');
                    }
                } else {
                    if (currentTemplate.isActive) {
                        currentTemplate.isActive = false;
                        templateChanged = true;
                        console.log('Template ' + currentTemplate.templateUniqId + ' deactivated.');
                    }
                }
            }
        }
    }

    if (!alternativeActive) {
        for (var i = 0; i < Publishment_Reader.currentPublishment.calendar.templates.length; i++) {
            var template = Publishment_Reader.currentPublishment.calendar.templates[i];
            if (template.typeOf === 'standart') {
                for (var j = 0; j < Publishment_Reader.currentPublishment.templates.length; j++) {
                    var currentTemplate = Publishment_Reader.currentPublishment.templates[j];
                    if (currentTemplate.templateUniqId === template.templateUniqId) {
                        if (!currentTemplate.isActive) {
                            currentTemplate.isActive = true;
                            templateChanged = true;
                            console.log('Standard Template ' + currentTemplate.templateUniqId + ' activated.');
                        }
                    } else {
                        if (currentTemplate.isActive) {
                            currentTemplate.isActive = false;
                            templateChanged = true;
                            console.log('Template ' + currentTemplate.templateUniqId + ' deactivated.');
                        }
                    }
                }
            }
        }
    }

    if (templateChanged) {
        Publishment_Reader.parseLatestPublishment(Publishment_Reader.currentPublishment);
    }
}
