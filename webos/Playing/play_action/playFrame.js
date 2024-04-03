function Play_Frame(frameInfo, parentTemplateObject) {


    //console.log("Play_Frame this parentTemplateObject:" +JSON.stringify(parentTemplateObject) ,'Info');
    console.log("Play_Frame this frameInfo:" + JSON.stringify(frameInfo), 'Info');

    this.frameInfo = frameInfo;

    this.name = frameInfo.name;
    this.duration = frameInfo.duration;
    this.uniqueKey = frameInfo.uniqId;

    this.width = frameInfo.width;
    this.height = frameInfo.height;
    this.x = frameInfo.x;
    this.y = frameInfo.y;
    this.z = frameInfo.z;

    this.contentIndex = 0;
    this.playlistIndex = 0;

    this.currentContent = 0;
    this.previousContent = 0;

    this.isCurrentContentValid = true;
    this.stopFrameOperations = false;

    this.parentTemplateObject = parentTemplateObject;

    this.takeCameFromEndOfAContentFromGlobal = false;
    this.globalCameFromEndOfAContent = false;
    this.singleShotTimer = 0;

    //template i appent et Akin
    Player_Ui_Creator.UIElement.appendHTML("#template-" + this.parentTemplateObject.uniqueKey, this.generateUIElement());

}

Play_Frame.prototype.generateUIElement = function () {

    return '<div id="frame-{0}" class="playing-platform-frame" style="top:{1}px;left:{2}px;z-index:{3}; width:{4}px; height:{5}px; overflow: hidden; position: absolute;"></div>'.pxcFormatString(this.uniqueKey, this.y, this.x, Tools.defaultValue(this.z, 0), this.width, this.height);

}; 

Play_Frame.prototype.continueFrame = function (isComeFromEndOfAContent, notValidContent) {

    if (this.stopFrameOperations) return;

    if (this.takeCameFromEndOfAContentFromGlobal) {
        isComeFromEndOfAContent = this.globalCameFromEndOfAContent;
    }

    var validContentCount = 0;

    for (var i = 0; i < this.frameInfo.playlistInfoList.length; i++) {

        var playlistInfo = this.frameInfo.playlistInfoList[i];

        for (var j = 0; j < playlistInfo.contentInfoList.length; j++) {

            var contentInfo = playlistInfo.contentInfoList[j];

            if (contentInfo.isValid) {

                validContentCount++;
            }

        }


    }


    if (validContentCount == 0) {

        this.stopFrameOperations = true;

        if (this.currentContent) {

            this.deleteCurrentContent();

        }

        return;

    }

    //Tek çalma listesi için
    if (this.frameInfo.playlistInfoList.length == 1) {

        this.contentIndex++;

        var playlistInfo = this.frameInfo.playlistInfoList[0];

        if (this.contentIndex >= playlistInfo.contentInfoList.length) {

            this.contentIndex = 0;

        }


    } else { // Birden fazla çalma listesi için

        if (notValidContent == undefined)
            notValidContent = false;

        var playlistInfo = this.frameInfo.playlistInfoList[this.playlistIndex];
        if (playlistInfo.isSequent == true) {

            var sequentContentIndex = playlistInfo.sequentContentIndex;


            if (playlistInfo.startSequent) {

                playlistInfo.startSequent = false;

                if (sequentContentIndex + 1 >= playlistInfo.contentInfoList.length)
                    playlistInfo.sequentContentIndex = 0;
                else
                    playlistInfo.sequentContentIndex += 1;

                if (notValidContent == false) {
                    if (this.playlistIndex + 1 >= this.frameInfo.playlistInfoList.length) {

                        this.playlistIndex = 0;
                        this.contentIndex = 0;

                    } else { //Bir sonraki çalma listesi varsa, onun ilk içeriğine geç

                        this.playlistIndex++;
                        this.contentIndex = 0;

                    }
                }

                playlistInfo = this.frameInfo.playlistInfoList[this.playlistIndex];
                if (playlistInfo.isSequent == true) {
                    this.contentIndex = playlistInfo.sequentContentIndex;
                    playlistInfo.startSequent = true;
                }

            } else {

                this.contentIndex = sequentContentIndex;
                playlistInfo.startSequent = true;

            }

        } else {

            this.contentIndex++;

            //Mevcut .çalma listesinde başka içerik kalmamışsa
            if (this.contentIndex >= playlistInfo.contentInfoList.length) {

                //Bir sonraki çalma listesi yoksa ilk çalma listesine geri dön

                if (this.playlistIndex + 1 >= this.frameInfo.playlistInfoList.length) {

                    this.playlistIndex = 0;
                    this.contentIndex = 0;


                } else { //Bir sonraki çalma listesi varsa, onun ilk içeriğine geç

                    this.playlistIndex++;
                    this.contentIndex = 0;

                }

                playlistInfo = this.frameInfo.playlistInfoList[this.playlistIndex];
                if (playlistInfo) {
                    if (playlistInfo.isSequent == true) {
                        this.contentIndex = playlistInfo.sequentContentIndex;
                        playlistInfo.startSequent = true;
                    }
                }
            }

        }
    }

    this.playNextContent(isComeFromEndOfAContent);
};

Play_Frame.prototype.deleteFrame = function () {

    if (this.singleShotTimer != 0) {
        clearTimeout(this.singleShotTimer);
    }

    this.deleteCurrentContent();
    this.deletePreviousContent();


    $("#frame-" + this.uniqueKey).remove();

    this.parentTemplateObject = 0;

    this.frameInfo = 0;
}

Play_Frame.prototype.checkNextContentSchedule = function () {

    console.log("Play_Frame.checkNextContentSchedule" + "Checking next content schedule.");

    var playlistInfoList = this.frameInfo.playlistInfoList;
    if (playlistInfoList.length == 0)
        return true;

    var contentInfoList = playlistInfoList[this.playlistIndex].contentInfoList;
    if (contentInfoList.length == 0)
        return true;

    var contentInfo = contentInfoList[this.contentIndex];

    if (!contentInfo.isValid) {
        console.log("Play_Frame.checkNextContentSchedule" + "Content is marked as invalid. No need to check for schedule. Continuing.");
        return false;
    }

    //days check start    
    var days = contentInfo.days;
    console.log("Play_Frame.checkNextContentSchedule" + "Checking day of week schedule for frame id:{0} content id:{1}. Days value:{2}".pxcFormatString(this.id, contentInfo.id, days));

    if (!Tools.isEmptyString(days) && days.length === 7) {
        var currentDateTime = moment();

        var dayOfWeek = currentDateTime.isoWeekday() - 1;
        if (days[dayOfWeek] == '0') {
            console.log("Play_Frame.checkNextContentSchedule" + "Content should not be played on this day. Returning false. Continuing.");
            return false;
        } else {
            console.log("Play_Frame.checkNextContentSchedule" + "Schedule check has passed with success for day of week. Continuing.");
        }
    } else {
        console.log("Play_Frame.checkNextContentSchedule" + "Days value is either empty or not 7 digits. Continuing.");
    }
    //days check end

    //start date check start
    var contentStartDate = moment(contentInfo.startDate, "YYYY-MM-DD");
    console.log("Play_Frame.checkNextContentSchedule" + "Checking start date schedule for frame id:{0} content id:{1}. Start date value:{2}".pxcFormatString(this.id, contentInfo.id, contentInfo.startDate));
    if (contentStartDate.isValid()) {
        if (Tools.getDateTimeNow().isBefore(contentStartDate)) {
            console.log("Play_Frame.checkNextContentSchedule" + "Current date is before than content start date. Returning false. Continuing.");
            return false;
        } else {
            console.log("Play_Frame.checkNextContentSchedule" + "Schedule check has passed with success for start date. Continuing.");
        }
    } else {
        console.log("Play_Frame.checkNextContentSchedule" + "Start date value is not a valid date. Continuing.");
    }
    //start date check end

    //start time check start
    console.log("Play_Frame.checkNextContentSchedule" + "Checking start time schedule for frame id:{0} content id:{1}. Start time value:{2}".pxcFormatString(this.id, contentInfo.id, contentInfo.startTime));
    if (moment(contentInfo.startTime, "HH:mm:ss").isValid()) {
        var formedStartTime = Tools.getDateTimeNow().format("DD.MM.YYYY");
        formedStartTime += " " + contentInfo.startTime;
        formedStartTime = moment(formedStartTime, "DD.MM.YYYY HH:mm:ss");
        if (formedStartTime.isValid()) {
            if (Tools.getDateTimeNow().isBefore(formedStartTime)) {
                console.log("Play_Frame.checkNextContentSchedule" + "Current time is less than content start time. Returning false. Continuing.");
                return false;
            } else {
                console.log("Play_Frame.checkNextContentSchedule" + "Schedule check has passed with success for start time. Continuing.");
            }
        } else {
            console.log("Play_Frame.checkNextContentSchedule" + "Start time value is not a valid time. Continuing.");
        }
    }
    //start time check end

    //end time check start
    console.log("Play_Frame.checkNextContentSchedule" + "Checking end time schedule for frame id:{0} content id:{1}. End time value:{2}".pxcFormatString(this.id, contentInfo.id, contentInfo.endTime));
    if (moment(contentInfo.endTime, "HH:mm:ss").isValid()) {
        var formedEndTime = Tools.getDateTimeNow().format("DD.MM.YYYY");
        formedEndTime += " " + contentInfo.endTime;
        formedEndTime = moment(formedEndTime, "DD.MM.YYYY HH:mm:ss");

        if (formedEndTime.isValid()) {
            if (Tools.getDateTimeNow().isAfter(formedEndTime)) {
                console.log("Play_Frame.checkNextContentSchedule" + "Current time is greater than content end time. Returning false. Continuing.");
                return false;
            } else {
                console.log("Play_Frame.checkNextContentSchedule" + "Schedule check has passed with success for end time. Continuing.");
            }

        } else {
            console.log("Play_Frame.checkNextContentSchedule" + "End time value is not a valid time. Continuing.");
        }
    }
    //end time check end
    console.log("Play_Frame.checkNextContentSchedule" + "Content is on schedule. Returning true.");
    return true;
}

Play_Frame.prototype.playNextContent = function (isComeFromEndOfAContent) {


    isComeFromEndOfAContent = Tools.defaultValue(isComeFromEndOfAContent, true);
    var isComeFromEndOfAContentStr = isComeFromEndOfAContent ? "true" : "false";

    this.takeCameFromEndOfAContentFromGlobal = false;
    this.globalCameFromEndOfAContent = false;
    console.log("Play_Frame.playNextContent" + "Checking next content schedule before playing. Play_Frame Id:{0}. PlaylistIndex:{1}. ContentIndex:{2}.".pxcFormatString(this.id, this.playlistIndex, this.contentIndex));
    var checkNextContentSchedule = this.checkNextContentSchedule();
    if (!checkNextContentSchedule) {

        this.takeCameFromEndOfAContentFromGlobal = true;
        this.globalCameFromEndOfAContent = isComeFromEndOfAContent;

        console.log("Play_Frame.playNextContent" + "Schedule check for next content has failed. Continuing for another content in 100ms.");

        this.frameInfo.setContentIsOnScheduleAt(this.playlistIndex, this.contentIndex, false);

        var validContentCount = 0;

        var playlisInfoList = this.frameInfo.playlistInfoList;

        if (playlisInfoList.length == 0) {
            console.log("Play_Frame.playNextContent" + "Play_Frame: {0} does not contain a playlist. Unexpected case. Returning.".pxcFormatString(this.id));
            return;
        }

        var contentInfoList = playlisInfoList[this.playlistIndex].contentInfoList;

        for (var II = 0; II < contentInfoList.length; II++) {
            var contentInfo = contentInfoList[II];
            if (contentInfo.isValid && contentInfo.isOnSchedule) {
                validContentCount++;
            }
        }

        if (this.currentContent) {
            if (validContentCount === 0) {
                this.deleteCurrentContent();
            }
        }

        var nextCheckInterval = validContentCount === 0 ? 1000 : 100;

        if (this.singleShotTimer != 0) {
            clearTimeout(this.singleShotTimer);
        }

        var _this = this;
        this.singleShotTimer = setTimeout(function () {
            if (validContentCount == 0) {
                _this.continueFrame();
            } else
                _this.continueFrame(false, true);
        }, nextCheckInterval);
        return;

    } else {
        this.frameInfo.setContentIsOnScheduleAt(this.playlistIndex, this.contentIndex, true);
    }

    var currentContentValidity = this.isCurrentContentValid;

    this.isCurrentContentValid = true;

    console.log("Play_Frame.playNextContent" + "Playing next content for frame:{0}. CameFromEndOfAContent:{1}".pxcFormatString(this.id, isComeFromEndOfAContentStr));
    if (this.frameInfo.playlistInfoList.length == 0) {
        console.log("Play_Frame.playNextContent1" + "Play_Frame: {0} does not contain a playlist. Unexpected case. Returning.".pxcFormatString(this.id));
        return;
    }

    if (this.frameInfo.playlistInfoList[this.playlistIndex].contentInfoList.length == 0) {
        console.log("Play_Frame.playNextContent2" + "Play_Frame: {0}. Playlist: {1} does not contain any content. Unexpected case. Returning.".pxcFormatString(this.id, this.frameInfo.playlistInfoList[this.playlistIndex].id));
        return;
    }

    if (!this.isNextContentValid()) {
        console.log("Play_Frame.playNextContent3" + "Play_Frame:{0} .Next content is invalid. Moving to next content.".pxcFormatString(this.id));
        this.continueFrame(isComeFromEndOfAContent);
        return;

    }


    var contentInfoList = this.frameInfo.playlistInfoList[this.playlistIndex].contentInfoList;
    var validContentCount = 0;

    for (var II = 0; II < contentInfoList.length; II++) {

        if (contentInfoList[II].isValid) {
            validContentCount++;
        }


    }

    console.log("Play_Frame.playNextContent4" + "Play_Frame:{0}. Valid content count:{1}".pxcFormatString(this.id, validContentCount));

    try {
        /*
        var frameContentCount = 0;
        this.frameInfo.playlistInfoList.forEach(element => {
            frameContentCount += contentInfoList.length;
        });*/
        var frameContentCount = 0;

        for (var i = 0; i < this.frameInfo.playlistInfoList.length; i++) {
            var element = this.frameInfo.playlistInfoList[i];
            frameContentCount += contentInfoList.length;
        }

        console.log("frameContentCount : " + frameContentCount)
        if (!currentContentValidity || frameContentCount == 1) {
            this.deleteCurrentContent();
        } else {
            this.previousContent = this.currentContent;
        }

        console.log("this.contentIndex : " + this.contentIndex)
        console.log("this.templateUniqueKey : " + this.frameInfo.templateUniqueKey)
        console.log("this.uniqueKey : " + this.frameInfo.uniqId)
        console.log("this.frameInfo.playlistInfoList[this.playlistIndex] : ", this.frameInfo.playlistInfoList[this.playlistIndex])

        console.log("this.frameInfo.playlistInfoList[this.playlistIndex].uniqueKey : ", this.frameInfo.playlistInfoList[this.playlistIndex].uniqId)

        var contentInfo = contentInfoList[this.contentIndex];
        contentInfo.templateUniqueKey = this.frameInfo.templateUniqueKey;
        contentInfo.frameUniqueKey = this.frameInfo.uniqId;
        contentInfo.playlistUniqueKey = this.frameInfo.playlistInfoList[this.playlistIndex].uniqId;
        console.log("contentInfo.type : " + contentInfo.type);
        console.log("contentInfo: " + JSON.stringify(contentInfo), 'Info');

        switch (contentInfo.type) {

            case Player.Content.Type.Unknown:
                break;
            case Player.Content.Type.Video:
                {
                    console.log("new Content_Video : " + contentInfo)
                    this.currentContent = new Content_Video(contentInfo, this);
                }
                break;
            case Player.Content.Type.Image:
                {
                    console.log("new Content_Image : " + contentInfo)
                    this.currentContent = new Content_Image(contentInfo, this);
                }
                break;
            case Player.Content.Type.Html:
                {
                    console.log("new Content_Html : " + contentInfo)
                    this.currentContent = new Content_Html(contentInfo, this);
                }
                break;
            case Player.Content.Type.Date:
                {
                    console.log("new Content_Date : " + contentInfo)
                    this.currentContent = new Content_Date(contentInfo, this);
                }
                break;
            case Player.Content.Type.Label:
                {
                    console.log("new Content_Label : " + contentInfo)
                    this.currentContent = new Content_Label(contentInfo, this);
                }
                break;
            case Player.Content.Type.Weather:
                {
                    console.log("new Content_Weather : " + contentInfo)
                    this.currentContent = new Content_Weather(contentInfo, this);
                }
                break;
            case Player.Content.Type.Currency:    
                {
                    console.log("new Currency : "+ contentInfo)
                    this.currentContent = new Content_Currency(contentInfo, this );
                }
            break;   
            case Player.Content.Type.Yandex:    
                {
                console.log("new Content_Yandex : "+ contentInfo)
                this.currentContent = new Content_Yandex(contentInfo, this );
                }
            break;      
            case Player.Content.Type.News:    
                {
                console.log("new Content.Type.News : "+ contentInfo)
                this.currentContent = new Content_ScrollText(contentInfo, this );
                }
            break;
            case Player.Content.Type.Stream:    
            {
                console.log("new Content.Type.Stream : "+ contentInfo)
                this.currentContent = new Content_Stream(contentInfo, this );
            }
           break;   
            
            default:
                break;
        }

        //this.currentContent = new Content_Image(contentInfo, this);

        if (this.currentContent) {
            console.log("this.currentContent.showContent : " + JSON.stringify(contentInfo))
            console.log("WEBOS VERSION : " + webOsHardwareVersion)

            var this_ = this;
            if (this.previousContent && webOsHardwareVersion <= "2.0") {
                this_.deletePreviousContent();

                this.currentContent.showContent(function () {

                })
                //this.setContentAnimations();

            }
            else if (this.previousContent && webOsHardwareVersion >= "3.0") {
                this.currentContent.showContent(function () {
                    setTimeout(function () {
                        this_.deletePreviousContent();
                    }, 1000);
                });
            }
            else {
                console.log("else this.currentContent.showContent : " + contentInfo)
                this.currentContent.showContent();
                //this.setContentAnimations();
            }

        }

    } catch (error) {
        console.log("error:" + error.message + ' - ' + error.stack);
    }
};

Play_Frame.prototype.deletePreviousContent = function () {

    if (this.previousContent) {
        console.log("Play_Frame.deleteContent" + "Play_Frame:{0}. Current Content:{1}. Previous Content:{2}. Deleting content:{3}".pxcFormatString(this.id, this.currentContent ? this.currentContent.id : "", this.previousContent ? this.previousContent.id : "", this.previousContent.id));
        if (this.previousContent.mainTimer) {
            clearTimeout(this.previousContent.mainTimer);
        }
        this.previousContent.deleteContent();
        this.previousContent = null;
    }

}

Play_Frame.prototype.deleteCurrentContent = function () {

    if (this.currentContent) {
        try {

            if (this.currentContent.mainTimer) {
                clearTimeout(this.currentContent.mainTimer);
            }

            this.currentContent.deleteContent();

            $("#frame-" + this.uniqueKey).empty();

            this.currentContent = 0;
        } catch (error) {
            console.log("deleteCurrentContent: error" + error);

        }
    }


};

Play_Frame.prototype.isNextContentValid = function () {


    var isValid = true;

    var contentInfo = this.frameInfo.playlistInfoList[this.playlistIndex].contentInfoList[this.contentIndex];

    contentInfo.setTemplateId(this.frameInfo.templateId);
    contentInfo.setFrameId(this.id);
    contentInfo.setPlaylistId(this.frameInfo.playlistInfoList[this.playlistIndex].id);
    isValid = contentInfo.isValid;
    var isValidStr = isValid ? "true" : "false";

    console.log("Play_Frame.isNextContentValid" + "Play_Frame:{0}. Content:{1}. Checking if next content is valid. Valid:{2}".pxcFormatString(this.id, contentInfo.id, isValidStr));

    if (!isValid) {

        return isValid;
    }
    if (moment(contentInfo.expireDate, "YYYY-MM-DD HH:mm:ss").isValid()) {

        contentInfo.expireDate += " 23:59:59";
        var expireDate = moment(contentInfo.expireDate, "YYYY-MM-DD HH:mm:ss");
        if (expireDate.isBefore(Tools.getDateTimeNow())) {
            console.log("Play_Frame.isNextContentValid" + "Play_Frame:{0}.Content:{1} is either expired or bad expiredate format. Settings content as invalid. ExpireDate:{2}".pxcFormatString(this.id, contentInfo.id, contentInfo.expireDate));
            this.frameInfo.setContentIsValidAt(this.playlistIndex, this.contentIndex, false);
            isValid = false;
        } else {

            if (contentInfo.duration < 1) {
                console.log("Play_Frame.isNextContentValid" + "Play_Frame:{0}.Content:{1} has duration less than 1. Settings content as invalid.".pxcFormatString(this.id, contentInfo.id));
                this.frameInfo.setContentIsValidAt(this.playlistIndex, this.contentIndex, false);
                isValid = false;
            }
        }

    }
    return isValid;


};

Play_Frame.prototype.startFrame = function () {

    this.contentIndex = 0;
    this.playlistIndex = 0;

    var playlistInfo = this.frameInfo.playlistInfoList[this.playlistIndex];

    console.log("Play_Frame.prototype.console.log:" + JSON.stringify(playlistInfo), 'Info');

    if (playlistInfo) {
        if (playlistInfo.isSequent == true) {
            if (playlistInfo.startSequent) {

                playlistInfo.startSequent = false;

                if (playlistInfo.sequentContentIndex + 1 >= playlistInfo.contentInfoList.length)
                    playlistInfo.sequentContentIndex = 0;
                else
                    playlistInfo.sequentContentIndex += 1;

                playlistInfo = this.frameInfo.playlistInfoList[this.playlistIndex];
                if (playlistInfo.isSequent == true) {
                    this.contentIndex = playlistInfo.sequentContentIndex;
                    playlistInfo.startSequent = true;
                }

            } else {

                this.contentIndex = playlistInfo.sequentContentIndex;
                playlistInfo.startSequent = true;

            }
        }

    }

    this.playNextContent(false);

};

Play_Frame.prototype.setCurrentContentValidity = function (isValid) {

    this.frameInfo.setContentIsValidAt(this.playlistIndex, this.contentIndex, isValid);
    this.isCurrentContentValid = isValid;
};

Play_Frame.prototype.setContentAnimations = function() {
    console.log("setContentAnimations");

    if (!this.previousContent)
    {
        console.log("setContentAnimations return");
        //return;
    }


    var _this = this;
    var $active = $("#content-" + this.previousContent.playlistContentUniqueKey);
    var $next = $("#content-" + this.currentContent.playlistContentUniqueKey);
    
    console.log("setContentAnimations1active:"+$active);
    console.log("setContentAnimations1next:"+$next);

    $next.css('z-index', 2);
    $active.fadeOut(2000, function() {
        $active.css('z-index', 1).show().removeClass('active');
        $next.css('z-index', 3).addClass('active');
        _this.animationCompleted(_this);
    });
};



Play_Frame.prototype.animationCompleted = function(context) {

    console.log("animCompleted");
    context.deletePreviousContent();

}