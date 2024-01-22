function Content_Html(contentInfo, parentFrameObject) {
    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {

        this.frameUniqueKey = parentFrameObject.uniqueKey;
        this.frameWidth = parentFrameObject.width;
        this.frameHeight = parentFrameObject.height;
        this.uniqueKey = contentInfo.uniqueKey;
        this.playlistContentUniqueKey = contentInfo.playlistContentUniqueKey+ moment().format('HHmmss');
        this.fileUrl = contentInfo.fileUrl;
        this.fileUniqueKey = contentInfo.fileUniqueKey;
        this.isCacheable = contentInfo.isCacheable;
        this.cacheExpireMinute = contentInfo.cacheExpireMinute;
        var fileFolderPath = "" //globalden al bunu
        this.name = contentInfo.name;

    
        this.htmlPath = "{0}/{1}/index.html?{2}".pxcFormatString(
            fileFolderPath,
            this.fileUniqueKey,
            Tools.guid()
        );

        this.widgetFolderPath = "{0}/{1}".pxcFormatString(
            fileFolderPath,
            this.fileUniqueKey
        );

        console.log(this.htmlPath)

        this.contentSelector = "#content-" + this.playlistContentUniqueKey;
        this.contentIframeSelector = "#iframe-content-" + this.playlistContentUniqueKey;
        this.contentIframeLoaded = 0;
        this.contentInfo = contentInfo;

        this.isWebPageWidget = this.contentInfo.getTypeContentProperty('url');
        console.log("this.isWebPageWidget:",this.isWebPageWidget);

    } catch (exception) {

        console.log("HTML constructor catch");
        console.log(exception);
    }
}

Content_Html.prototype = Object.create(Content_Abstractor.prototype);
Content_Html.prototype.constructor = Content_Html;

Content_Html.prototype.showContent = function(func) {
    Content_Abstractor.prototype.showContent.call(this);

    try {
      
        Player_Ui_Creator.UIElement.appendHTML(
            "#frame-" + this.frameUniqueKey,
            this.generateUIElement()
        );

        setTimeout(function() {
            if (func)
                func();
        }, 1000);


        var message = {
            Type : "openWebPage",
            Url :  this.contentInfo.getTypeContentProperty('url'),
            Duration: this.duration,
            Width: this.parentFrameObject.width,
            Height: this.parentFrameObject.height,
            X: this.parentFrameObject.x,
            Y: this.parentFrameObject.y,
            Z: this.parentFrameObject.z
        }

        window.parent.postMessage(JSON.stringify(message));
    
    } catch (exception) {

        console.log("EXCEPTION:" + exception);

        console.log(this.contentIframeSelector);

        this.contentEnded();
        return;
    }
};

Content_Html.prototype.deleteUIElement = function() {

    try {

        var message = {
            Type : "closeWebPage",
            Url :  this.contentInfo.getTypeContentProperty('url'),
            Duration: this.duration,
            Width: this.parentFrameObject.width,
            Height: this.parentFrameObject.height,
            X: this.parentFrameObject.x,
            Y: this.parentFrameObject.y,
            Z: this.parentFrameObject.z
        }

        window.parent.postMessage(JSON.stringify(message));

        $(this.contentSelector).remove();
    } catch (exception) {
        console.log("*******WIDGET DELETEUIELEMENT ERROR");
        console.log(exception);
    }
};

Content_Html.prototype.deleteContent = function() {
    try {
        this.contentIframeLoaded = 0;
        this.deleteUIElement();
        Content_Abstractor.prototype.deleteContent.call(this);
    } catch (exception) {
        console.log("*********WIDGET DELETECONTENT ERROR");
        console.log(exception);
    }
};

Content_Html.prototype.generateUIElement = function() {
  
        return '<div class="playing-platform-content" id="content-{0}"></div>'.pxcFormatString(
            this.playlistContentUniqueKey
        );
    
};