function Publishment_Reader (){

    this.currentPublishment = 0;
    this.templateList = [];
    this.calendarList = [];
    this.worker = 0;
    this.currentTemplate = 0;
    this.templateInfo = "";  
}

Publishment_Reader.prototype.parseLatestPublishment =  function(data) {

        console.log("parseLatestPublishment");

        this.clearPublisment();
        this.clearCurrentTemplate();

        this.currentPublishment = data;

        if (((!Publishment_Reader.currentPublishment.calendar || Publishment_Reader.currentPublishment.calendar.length == 0)) &&
        ((!Publishment_Reader.currentPublishment.templates || Publishment_Reader.currentPublishment.templates.length == 0))) {

            console.log("Publishment_Reader:showImage:" ,'Info');
            Tools.showImage(); //error durumu aslinda
        }else{
            console.log("Publishment_Reader:Hide Image:" ,'Info');
            Tools.hideImage();
        }

        Publishment_Reader.parseCalendars();
        Publishment_Reader.parseTemplates();
      
        /*
        Publishment_Reader.currentTemplate = new Play_Template();
        console.log("startTemplate this.templateInfo: ",this.templateList.length);
        Publishment_Reader.currentTemplate.startTemplate(this.templateInfo);

*/
        for (let index = 0; index < this.templateList.length; index++) {
            Publishment_Reader.currentTemplate = new Play_Template();
            Publishment_Reader.currentTemplate.startTemplate(this.templateList[index]);

        }
       
    }

Publishment_Reader.prototype.parseCalendars = function() {
    console.log("parseCalendars" ,'Info');
    if (!Publishment_Reader.currentPublishment.calendar) {
        this.calendarList = [];
    } else {

        for (let index = 0; index < Publishment_Reader.currentPublishment.calendar.templates.length; index++) {
            let templateCalendarInfo = new Parse_Calendar();
            let currentTemplateCalendarToParse = Publishment_Reader.currentPublishment.calendar.templates[index];

            templateCalendarInfo.setDays(Tools.defaultValue(currentTemplateCalendarToParse.days, ""));
            templateCalendarInfo.setTemplateUniqId(Tools.defaultValue(currentTemplateCalendarToParse.templateUniqId, ""));

            let startDate = moment(currentTemplateCalendarToParse.startDate, "YYYY-MM-DD");
            startDate = !startDate.isValid() ? "" : currentTemplateCalendarToParse.startDate;

            templateCalendarInfo.setStartDate(Tools.defaultValue(startDate, ""));

            let endDate = moment(currentTemplateCalendarToParse.endDate, "YYYY-MM-DD");
            endDate = !endDate.isValid() ? "" : currentTemplateCalendarToParse.endDate;

            templateCalendarInfo.setEndDate(Tools.defaultValue(endDate, ""));

            let startTime = moment(currentTemplateCalendarToParse.startTime, "HH:mm:ss");
            startTime = !startTime.isValid() ? "" : currentTemplateCalendarToParse.startTime;

            templateCalendarInfo.setStartTime(Tools.defaultValue(startTime, ""));

            let endTime = moment(currentTemplateCalendarToParse.endTime, "HH:mm:ss");
            endTime = !endTime.isValid() ? "" : currentTemplateCalendarToParse.endTime;

            templateCalendarInfo.setEndTime(Tools.defaultValue(endTime, ""));

            templateCalendarInfo.setTemplateId(Tools.defaultValue(currentTemplateCalendarToParse.id, ""));
            console.log("parseCalendars: function() = > " +JSON.stringify(templateCalendarInfo),'Info');

            this.calendarList.push(templateCalendarInfo);
        }
    }
}

Publishment_Reader.prototype.parseTemplates = function() {

    if (!Publishment_Reader.currentPublishment.templates) {
        Publishment_Reader.templateList = [];
    } else {
        let source = 0;
            source = Publishment_Reader.currentPublishment.templates;

        for (let index = 0; index < source.length; index++) {
            this.templateInfo = new Parse_Template();
            let currentTemplateInfoToParse = source[index];

            currentTemplateInfoToParse.duration = currentTemplateInfoToParse.duration - 1;
            
            Publishment_Reader.parseBasicAttributes(this.templateInfo, currentTemplateInfoToParse,currentTemplateInfoToParse.templateUniqId);
            Publishment_Reader.parseFrames(this.templateInfo, currentTemplateInfoToParse);

            this.templateInfo.templateUniqId = currentTemplateInfoToParse.templateUniqId;
            console.log("parseTemplates: function() = > " +JSON.stringify(this.templateInfo),'Info');

            Publishment_Reader.templateList.push(this.templateInfo);

        }

    }
}

Publishment_Reader.prototype.parseFrames = function(templateInfo, templateInfoToParse) {

    if (!templateInfoToParse.frames) {
        return;
    }

    for (let index = 0; index < templateInfoToParse.frames.length; index++) {
        let frameInfo = new Parse_Frame();
        let currentFrameInfoToParse = templateInfoToParse.frames[index];
        Publishment_Reader.parseBasicAttributes(frameInfo, currentFrameInfoToParse,currentFrameInfoToParse.frameUniqId);
        Publishment_Reader.parsePlaylists(frameInfo, currentFrameInfoToParse);
        console.log("parseFrames: function() = > " +JSON.stringify(frameInfo),'Info');
        templateInfo.addToFrameInfoList(frameInfo);
    }

}

Publishment_Reader.prototype.parsePlaylists = function(templateInfo, templateInfoToParse) {
    
    if (!templateInfoToParse.playlists) {
        return;
    }

    for (let index = 0; index < templateInfoToParse.playlists.length; index++) {

        if (templateInfoToParse.playlists[index].contents.length != 0) {
            let playlistInfo = new Parse_Playlist();
            let currentPlaylistInfoToParse = templateInfoToParse.playlists[index];
            Publishment_Reader.parseBasicAttributes(playlistInfo, currentPlaylistInfoToParse,currentPlaylistInfoToParse.playlistUniqId);
            Publishment_Reader.parseContents(playlistInfo, currentPlaylistInfoToParse);
            console.log("parsePlaylists: function() = > " +JSON.stringify(playlistInfo),'Info');
            templateInfo.addToPlaylistInfoList(playlistInfo);
        }
    }
}

Publishment_Reader.prototype.parseContents = function(playlistInfo, playlistInfoToParse) {
    if (!playlistInfoToParse.contents) {
        return;
    }
    let contentArray = [];
    for (let index = 0; index < playlistInfoToParse.contents.length; index++) {
        let contentInfo = new Parse_Content();
        let currentContentInfoToParse = playlistInfoToParse.contents[index];
        Publishment_Reader.parseBasicAttributes(contentInfo, currentContentInfoToParse);
        contentInfo.setPlaylistContentUniqueKey(Tools.defaultValue(currentContentInfoToParse.playlistUniqId, ""));
        //Akin sonradan tekrar düzenlenecek
        contentInfo.setType(Tools.defaultValue(currentContentInfoToParse.type, "unknown"));
        contentInfo.setFileName(Tools.defaultValue(currentContentInfoToParse.name, "unknown"));

        contentInfo.setFileUniqueKey(Tools.defaultValue(currentContentInfoToParse.contentUniqId, ""));
        
        let expireDate = moment(currentContentInfoToParse.endDate, "YYYY-MM-DD HH:mm:ss");
        expireDate = !expireDate.isValid() ? "" : currentContentInfoToParse.endDate;
        contentInfo.setExpireDate(Tools.defaultValue(expireDate, ""));

        let startDate = moment(currentContentInfoToParse.startDate, "YYYY-MM-DD");
        startDate = !startDate.isValid() ? "" : currentContentInfoToParse.startDate;
        contentInfo.setStartDate(Tools.defaultValue(startDate, ""));

        let startTime = moment(currentContentInfoToParse.startTime, "HH:mm:ss");
        startTime = !startTime.isValid() ? "" : currentContentInfoToParse.startTime;
        contentInfo.setStartTime(Tools.defaultValue(startTime, ""));

        let endTime = moment(currentContentInfoToParse.endTime, "HH:mm:ss");
        endTime = !endTime.isValid() ? "" : currentContentInfoToParse.endTime;
        contentInfo.setEndTime(Tools.defaultValue(endTime, ""));

        let days = currentContentInfoToParse.days ? currentContentInfoToParse.days : "1111111";
        contentInfo.setDays(days);

        contentInfo.setRepeatCount(Tools.defaultValue(0, 0));
                    
        let loop = currentContentInfoToParse.loop=='1' ? true : false;
        contentInfo.setLoop(loop);


        if (currentContentInfoToParse.contentProperties) 
        {
            for (let index = 0; index < currentContentInfoToParse.contentProperties.length; index++) {
                const element = currentContentInfoToParse.contentProperties[index];
                console.log("contentArray element:",element)

                contentInfo.setTypeContentProperty(element.name,element.value);   
            }

        }
        
        contentArray.push(contentInfo);
    }

    console.log(contentArray)
    for (let index = 0; index < contentArray.length; index++) {
        playlistInfo.addToContentInfoList(contentArray[index]);
    }
}    
    

Publishment_Reader.prototype.parseBasicAttributes = function(info, object,uniqId) {
        
        info.duration = (Tools.defaultValue(object.duration, 0));
        info.uniqId = (Tools.defaultValue(uniqId, ""));
        info.id = (Tools.defaultValue(object.id, ""));
        info.name = (Tools.defaultValue(object.name, ""));
        info.width = (Tools.defaultValue(object.width, 0));
        info.height = (Tools.defaultValue(object.height, 0));
        info.x = (Tools.defaultValue(object.x, 0));
        info.y =(Tools.defaultValue(object.y, 0));
        info.z = (Tools.defaultValue(object.z, 0));
        info.position = (Tools.defaultValue(object.position, 0));
        console.log("parseBasicAttributes:",info);
}


Publishment_Reader.prototype.clearPublisment =  function() {

    Publishment_Reader.templateList = [];
    Publishment_Reader.calendarList = [];

    if (Publishment_Reader.currentPublishment != 0) {
        delete Publishment_Reader.currentPublishment;
        Publishment_Reader.currentPublishment = 0;
    }
}

Publishment_Reader.prototype.clearCurrentTemplate =  function() {
    if (Publishment_Reader.currentTemplate) {
        Publishment_Reader.currentTemplate.deleteTemplate();
        Publishment_Reader.currentTemplate = 0;
        $(".playing-platform-template").remove();
    }
}


