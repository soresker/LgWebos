function Publisher() {}

Publisher.playerGlobalData = "";
Publisher.publishData = "";
Publisher.videoType = 0;
Publisher.currencyValues = "";
Publisher.templateCheckInterval = null; // Interval ID'sini saklamak için

Publisher.newPublishment = function(publishmentData) {
    try {
        if (Tools.isObject(publishmentData)) {
            console.log("publishmentData isObject");
            Publisher.publishData = publishmentData;
        } else {
            Publisher.publishData = JSON.parse(publishmentData);
        }
    } catch (exception) {
        console.log("error : ", exception);
    }
    Publishment_Reader.parseLatestPublishment(Publisher.publishData);
    Publisher.startTemplateCheck();
};

Publisher.setGlobalData = function(data) {
    var parsedData = JSON.parse(data);
    Publisher.playerGlobalData = parsedData.filePath;
    Publisher.videoType = parsedData.videoMode;
    console.log("JSON.parse(data).videoMode:", Publisher.videoType);
};

Publisher.setCurrencyData = function(data) {
    var parsedData = JSON.parse(data);
    Publisher.currencyValues = {
        usd: parsedData.usd,
        euro: parsedData.euro,
    };
    console.log("setCurrencyData:", Publisher.currencyValues);
};

Publisher.startTemplateCheck = function() {
    if (Publisher.templateCheckInterval !== null) {
        console.log("Template check interval already running");
        return;
    }
    
    Publisher.templateCheckInterval = setInterval(function() {
        Publisher.checkTemplates();
    }, 10000); // 10 saniyede bir çalışır
};

Publisher.checkTemplates = function() {
    var now = moment();
    var templateChanged = false;

    console.log("checkTemplates called at: ", now.format());

    var alternativeActive = false;
    for (var i = 0; i < currentPublishment.calendar.templates.length; i++) {
        var template = currentPublishment.calendar.templates[i];
        var startTime = moment(template.startTime, "HH:mm:ss");
        var endTime = moment(template.endTime, "HH:mm:ss");

        if (template.typeOf === 'alternative' && now.isBetween(startTime, endTime)) {
            alternativeActive = true;
            for (var j = 0; j < currentPublishment.templates.length; j++) {
                var currentTemplate = currentPublishment.templates[j];
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
        for (var i = 0; i < currentPublishment.calendar.templates.length; i++) {
            var template = currentPublishment.calendar.templates[i];
            if (template.typeOf === 'standard') {
                for (var j = 0; j < currentPublishment.templates.length; j++) {
                    var currentTemplate = currentPublishment.templates[j];
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
        Publishment_Reader.parseLatestPublishment(currentPublishment);
    }
};
