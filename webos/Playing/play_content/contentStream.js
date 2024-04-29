function Content_Stream(contentInfo, parentFrameObject) {

    console.log("Content_Stream", 'Info');

    Content_Abstractor.call(this, contentInfo, parentFrameObject);

    // this.x = 0; //parentFrameObject.x;
    /// this.y = 0; //parentFrameObject.y;

    this.width = contentInfo.width;
    this.height = contentInfo.height;

    this.frameUniqueKey = contentInfo.frameUniqueKey;

    this.loop = true;
    this.volume = contentInfo.volume;

    this.attachedErrorHandler = false;
    this.attachedMetaDataHandler = false;
    this.attachedTimeUpdateHandler = false;
    this.attachedPlayHandler = false;
    this.attachedPauseHandler = false;
    this.videoHandlers = {};
    this.videoPlayed = false;

    this.errorHandler = 0;
    this.metaDataHandler = 0;
    this.timeUpdateHandler = 0;
    this.playHandler = 0;
    this.pauseHandler = 0;

    this.x = contentInfo.x;
    this.y = contentInfo.y;
    this.z = contentInfo.z;

    var guid = moment().format('HHmmss');

    this.settingSeekStart = false;
    this.videoSelector = "#content-" + contentInfo.playlistUniqueKey + '-' + guid + "-video";
    this.videoRepeatCount = 1;
    globalVideoPath = this.videoSelector;

    this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' + guid;
    this.fileName = contentInfo.getTypeContentProperty("filename");
    this.displayOption = contentInfo.getTypeContentProperty("displayoption");
    this.streamUrl = contentInfo.getTypeContentProperty("streamUrl");
    this.streamType = contentInfo.getTypeContentProperty("streamType");
    this.videoType = contentInfo.getTypeContentProperty("videoType");

}

Content_Stream.prototype = Object.create(Content_Abstractor.prototype);
Content_Stream.prototype.constructor = Content_Stream;

Content_Stream.prototype.addListener = function (node, event, handler, capture) {
    if (!(node in this.videoHandlers)) {
        this.videoHandlers[node] = {};
    }
    if (!(event in this.videoHandlers[node])) {
        this.videoHandlers[node][event] = [];
    }
    this.videoHandlers[node][event].push([handler, capture]);
    node.addEventListener(event, handler, capture);
};

Content_Stream.prototype.removeAllListeners = function (node, event) {
    if (node in this.videoHandlers) {
        var handlers = this.videoHandlers[node];
        if (event in handlers) {
            var eventHandlers = handlers[event];
            for (var i = eventHandlers.length; i--;) {
                var handler = eventHandlers[i];
                node.removeEventListener(event, handler[0], handler[1]);
            }
        }
    }
};

Content_Stream.prototype.showContent = function (func) {

    Content_Abstractor.prototype.showContent.call(this);

    try {

        Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());

        // Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateScreenShotElement());

        var source = document.createElement("source");

        var fileUrlEdits = this.streamUrl;
        $(source).attr('src', fileUrlEdits);
        $(source).attr('type', this.streamType);

        //$(this.videoSelector).attr('src',fileUrlEdits);
        $(this.videoSelector).attr('data-setup', "{}");
        $(this.videoSelector).attr('autoplay', "true");
        $(this.videoSelector).attr('muted', "muted");
        $(this.videoSelector).attr('class', "video-js");
        $(this.videoSelector).attr('controls', '');

        $(this.videoSelector).append(source);


        console.log("Video.basePath2:" + fileUrlEdits);

        if (this.settingSeekStart)
            this.settingSeekStart = false;

        if (this.loop) {
            $(this.videoSelector).attr("loop", "loop");
        }

        videojs(this.videoSelector, {}, function onPlayerReady() {
            this.play();
        });
        var this_ = this;

        $(this_.videoSelector).show();
        if (func)
            func();
        this_.videoPlayed = true;

    } catch (exception) {
        console.log("[Video][Error]", exception)
        this.parentFrameObject.setCurrentContentValidity(false);
        if (func)
            func();
        this.contentEnded();
        return;
    }

};

Content_Stream.prototype.deleteUIElement = function () {

    console.log("Video deleteUIElement " + "info");
    try {

        if (this.attachedErrorHandler === true) {
            $(this.videoSelector)[0].removeEventListener('error', this.errorHandler, true);
        }

        if (this.attachedMetaDataHandler === true) {
            $(this.videoSelector)[0].removeEventListener('loadedmetadata', this.metaDataHandler, true);
        }

        if (this.attachedPlayHandler === true) {
            $(this.videoSelector)[0].removeEventListener('play', this.playHandler, true);
        }

        if (this.attachedTimeUpdateHandler === true) {
            $(this.videoSelector)[0].removeEventListener('timeupdate', this.timeUpdateHandler, true);
        }

        if (this.attachedPauseHandler === true) {
            $(this.videoSelector)[0].removeEventListener('pause', this.pauseHandler, true);
        }

        var video = document.getElementById("content-" + this.playlistContentUniqueKey + "-video");
        this.removeAllListeners(video, 'timeupdate');

    } catch (exception) {
        console.log(" exception Video deleteUIElement :" + exception, "error");
        console.log("exception  Content_Stream.deleteUIElement", + exception, "error");
        this.parentFrameObject.setCurrentContentValidity(false);
    } finally { }
};

Content_Stream.prototype.deleteContent = function () {
    console.log("Content_Stream.prototype.deleteContent", this.videoType);
    this.deleteUIElement();
    $('#content-' + this.playlistContentUniqueKey).remove();
    Content_Abstractor.prototype.deleteContent.call(this);

};

Content_Stream.prototype.generateUIElement = function () {
    return '<div id="content-{0}" style="z-index:{3};width:{4}px; height:{5}px; position:relative"><video muted onloadeddata="this.muted={7}" onloadstart="this.volume={6}" id="content-{0}-video" class="playing-platform-content playing-platform-content-video" style="width:{4}px; height:{5}px; object-fit: fill; background-color:black;" data-videorepeatcount="1"></video></div>'.pxcFormatString(this.playlistContentUniqueKey, this.y, this.x, Tools.defaultValue(this.z, 0), this.width, this.height, this.volume * 1.0 / 100, this.volume == 0 ? "true" : "false");
};
Content_Stream.prototype.generateScreenShotElement = function () {
    return '<div id="player-image">' +
        '<img id="screen-shot-image" src="./Playing/common/noplaylist.png"/>' +
        '</div>';
};