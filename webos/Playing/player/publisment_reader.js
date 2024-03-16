function Publishment_Reader() {}

var currentPublishment = 0;
var templateList = [];
var calendarList = [];
var worker = 0;
var currentTemplate = 0;
var templateInfo = "";

Publishment_Reader.parseLatestPublishment = function (data) {
    console.log("parseLatestPublishment");

    Publishment_Reader.clearPublisment();
    Publishment_Reader.clearCurrentTemplate();

    currentPublishment = data;

    if (
        (!currentPublishment.calendar || currentPublishment.calendar.length == 0) &&
        (!currentPublishment.templates || currentPublishment.templates.length == 0)
    ) {
        console.log("Publishmentta SORUN VAR templates: "+currentPublishment.templates);
        setTimeout(function() {sendConsoleLog("Publishmentta SORUN VAR templates yok bos yayin: ");}, 5000);
        //Tools.showImage(); //error durumu aslinda
    }else if (!currentPublishment.templates[0].frames || currentPublishment.templates[0].frames.length == 0 )
    {
        console.log("Publishmentta SORUN VAR frame yok bos yayin: ");
        setTimeout(function() {sendConsoleLog("Publishmentta SORUN VAR frame yok bos yayin: ");}, 5000);
    }
    else {
        console.log("Publishment_Reader:Hide Image:", "Info");
        Tools.hideImage();
    }

    Publishment_Reader.parseCalendars();
    Publishment_Reader.parseTemplates();

    for (var index = 0; index < templateList.length; index++) {
        currentTemplate = new Play_Template();
        currentTemplate.startTemplate(templateList[index]);
    }
};

Publishment_Reader.parseCalendars = function () {
    console.log("parseCalendars", "Info");
    if (!currentPublishment.calendar) {
        calendarList = [];
    } else {
        for (var index = 0; index < currentPublishment.calendar.templates.length; index++) {
            var templateCalendarInfo = new Parse_Calendar();
            var currentTemplateCalendarToParse = currentPublishment.calendar.templates[index];

            templateCalendarInfo.setDays(Tools.defaultValue(currentTemplateCalendarToParse.days, ""));
            templateCalendarInfo.setTemplateUniqId(Tools.defaultValue(currentTemplateCalendarToParse.templateUniqId, ""));

            var startDate = moment(currentTemplateCalendarToParse.startDate, "YYYY-MM-DD");
            startDate = !startDate.isValid() ? "" : currentTemplateCalendarToParse.startDate;

            templateCalendarInfo.setStartDate(Tools.defaultValue(startDate, ""));

            var endDate = moment(currentTemplateCalendarToParse.endDate, "YYYY-MM-DD");
            endDate = !endDate.isValid() ? "" : currentTemplateCalendarToParse.endDate;

            templateCalendarInfo.setEndDate(Tools.defaultValue(endDate, ""));

            var startTime = moment(currentTemplateCalendarToParse.startTime, "HH:mm:ss");
            startTime = !startTime.isValid() ? "" : currentTemplateCalendarToParse.startTime;

            templateCalendarInfo.setStartTime(Tools.defaultValue(startTime, ""));

            var endTime = moment(currentTemplateCalendarToParse.endTime, "HH:mm:ss");
            endTime = !endTime.isValid() ? "" : currentTemplateCalendarToParse.endTime;

            templateCalendarInfo.setEndTime(Tools.defaultValue(endTime, ""));

            templateCalendarInfo.setTemplateId(Tools.defaultValue(currentTemplateCalendarToParse.id, ""));
            console.log("parseCalendars: function() = > " + JSON.stringify(templateCalendarInfo), "Info");

            calendarList.push(templateCalendarInfo);
        }
    }
};

Publishment_Reader.parseTemplates = function () {
    if (!currentPublishment.templates) {
        templateList = [];
    } else {
        var source = 0;
        source = currentPublishment.templates;

        for (var index = 0; index < source.length; index++) {
            templateInfo = new Parse_Template();
            var currentTemplateInfoToParse = source[index];

            currentTemplateInfoToParse.duration = currentTemplateInfoToParse.duration - 1;

            Publishment_Reader.parseBasicAttributes(templateInfo, currentTemplateInfoToParse, currentTemplateInfoToParse.templateUniqId);
            Publishment_Reader.parseFrames(templateInfo, currentTemplateInfoToParse);

            templateInfo.templateUniqId = currentTemplateInfoToParse.templateUniqId;
            console.log("parseTemplates: function() = > " + JSON.stringify(templateInfo), "Info");

            templateList.push(templateInfo);
        }
    }
};

Publishment_Reader.parseFrames = function (templateInfo, templateInfoToParse) {
    if (!templateInfoToParse.frames) {
        return;
    }

    for (var index = 0; index < templateInfoToParse.frames.length; index++) {
        var frameInfo = new Parse_Frame();
        var currentFrameInfoToParse = templateInfoToParse.frames[index];
        Publishment_Reader.parseBasicAttributes(frameInfo, currentFrameInfoToParse, currentFrameInfoToParse.frameUniqId);
        Publishment_Reader.parsePlaylists(frameInfo, currentFrameInfoToParse);
        console.log("parseFrames: function() = > " + JSON.stringify(frameInfo), "Info");
        templateInfo.addToFrameInfoList(frameInfo);
    }
};

Publishment_Reader.parsePlaylists = function (templateInfo, templateInfoToParse) {
    if (!templateInfoToParse.playlists) {
        return;
    }

    for (var index = 0; index < templateInfoToParse.playlists.length; index++) {
        if (templateInfoToParse.playlists[index].contents.length != 0) {
            var playlistInfo = new Parse_Playlist();
            var currentPlaylistInfoToParse = templateInfoToParse.playlists[index];
            Publishment_Reader.parseBasicAttributes(playlistInfo, currentPlaylistInfoToParse, currentPlaylistInfoToParse.playlistUniqId);
            Publishment_Reader.parseContents(playlistInfo, currentPlaylistInfoToParse);
            console.log("parsePlaylists: function() = > " + JSON.stringify(playlistInfo), "Info");
            templateInfo.addToPlaylistInfoList(playlistInfo);
        }
    }
};

Publishment_Reader.parseContents = function (playlistInfo, playlistInfoToParse) {
    if (!playlistInfoToParse.contents) {
        return;
    }
    var contentArray = [];
    for (var index = 0; index < playlistInfoToParse.contents.length; index++) {
        var contentInfo = new Parse_Content();
        var currentContentInfoToParse = playlistInfoToParse.contents[index];
        Publishment_Reader.parseBasicAttributes(contentInfo, currentContentInfoToParse);
        contentInfo.setPlaylistContentUniqueKey(Tools.defaultValue(currentContentInfoToParse.playlistUniqId, ""));
        //Akin sonradan tekrar düzenlenecek
        contentInfo.setType(Tools.defaultValue(currentContentInfoToParse.type, "unknown"));
        contentInfo.setFileName(Tools.defaultValue(currentContentInfoToParse.name, "unknown"));

        contentInfo.setFileUniqueKey(Tools.defaultValue(currentContentInfoToParse.contentUniqId, ""));

        var expireDate = moment(currentContentInfoToParse.expireDate, "YYYY-MM-DD");
        expireDate = !expireDate.isValid() ? "" : currentContentInfoToParse.expireDate;
        contentInfo.setExpireDate(Tools.defaultValue(expireDate, ""));

        var startDate = moment(currentContentInfoToParse.startDate, "YYYY-MM-DD");
        startDate = !startDate.isValid() ? "" : currentContentInfoToParse.startDate;
        contentInfo.setStartDate(Tools.defaultValue(startDate, ""));

        var startTime = moment(currentContentInfoToParse.startTime, "HH:mm:ss");
        startTime = !startTime.isValid() ? "" : currentContentInfoToParse.startTime;
        contentInfo.setStartTime(Tools.defaultValue(startTime, ""));

        var endTime = moment(currentContentInfoToParse.endTime, "HH:mm:ss");
        endTime = !endTime.isValid() ? "" : currentContentInfoToParse.endTime;
        contentInfo.setEndTime(Tools.defaultValue(endTime, ""));

        var days = currentContentInfoToParse.days ? currentContentInfoToParse.days : "1111111";
        contentInfo.setDays(days);

        contentInfo.setRepeatCount(Tools.defaultValue(0, 0));

        var loop = currentContentInfoToParse.loop == '1' ? true : false;
        contentInfo.setLoop(loop);

        if (currentContentInfoToParse.contentProperties) {
            for (var i = 0; i < currentContentInfoToParse.contentProperties.length; i++) {
                var element = currentContentInfoToParse.contentProperties[i];
                console.log("contentArray element:", element);

                contentInfo.setTypeContentProperty(element.name, element.value);
            }
        }

        contentArray.push(contentInfo);
    }

    console.log(contentArray);
    for (var i = 0; i < contentArray.length; i++) {
        playlistInfo.addToContentInfoList(contentArray[i]);
    }
};

Publishment_Reader.parseBasicAttributes = function (info, object, uniqId) {
    info.duration = Tools.defaultValue(object.duration, 0);
    info.uniqId = Tools.defaultValue(uniqId, "");
    info.id = Tools.defaultValue(object.id, "");
    info.name = Tools.defaultValue(object.name, "");
    info.width = Tools.defaultValue(object.width, 0);
    info.height = Tools.defaultValue(object.height, 0);
    info.x = Tools.defaultValue(object.x, 0);
    info.y = Tools.defaultValue(object.y, 0);
    info.z = Tools.defaultValue(object.z, 0);
    info.position = Tools.defaultValue(object.position, 0);
    console.log("parseBasicAttributes:", info);
};

Publishment_Reader.clearPublisment = function () {
    templateList = [];
    calendarList = [];

    if (currentPublishment != 0) {
        delete currentPublishment;
        currentPublishment = 0;
    }
};

Publishment_Reader.clearCurrentTemplate = function () {
    if (currentTemplate) {
        currentTemplate.deleteTemplate();
        currentTemplate = 0;
        $(".playing-platform-template").remove();
    }
};
