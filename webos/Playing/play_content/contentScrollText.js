var result = "";

function Content_ScrollText(contentInfo, parentFrameObject) {
    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {
        this.width = parentFrameObject.width;
        this.height = parentFrameObject.height;
        this.x = 0;
        this.y = 0;

        this.speed = Number(contentInfo.getTypeContentProperty("speed"));
        this.value = contentInfo.getTypeContentProperty("contents");
        this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
        this.textColor = contentInfo.getTypeContentProperty("color");
        this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
        this.textSizePixels = Number(contentInfo.getTypeContentProperty("fontSize"));
        this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
        this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");
        this.textFontType = contentInfo.getTypeContentProperty("fontType");

        this.frameUniqueKey = parentFrameObject.uniqueKey;
        this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' + Math.floor(Math.random() * 10000);

        console.log("Content_ScrollText this.textFontFamily: "+this.textFontFamily);
        console.log("Content_ScrollText this.textFontType"+ this.textFontType);
        console.log("Content_ScrollText this.speed" + this.speed);
    }
    catch (exception) {
        console.log("Content_ScrollText EX", exception);
    }
}


Content_ScrollText.prototype = Object.create(Content_Abstractor.prototype);
Content_ScrollText.prototype.constructor = Content_ScrollText;

Content_ScrollText.prototype.showContent = function (func) {
    try {
        Content_Abstractor.prototype.showContent.call(this);
        
        var _this = this;

        if(this.speed === 0) {
            var contentArray = JSON.parse(this.value);
            result = contentArray.reduce(function(acc, item) {
                return acc + item.replace(/<\/?p>/g, ''); // <p> etiketlerini kaldır
            }, '');
            Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElementNoSpeed());
        } else {
            Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());
        }

        var fontPath = Publisher.playerGlobalData.replace(/\\/g, '/').replace("/contents/","/fonts/");

        // Font yükleme işlemi
        if (!Tools.isEmptyString(this.textFontFamily)) {

            if(this.textFontFamily === "verdana") {
                console.log("Content_ScrollText this.textFontFamily", this.textFontFamily);
                if(this.speed === 0) {
                    $("#content-" + _this.playlistContentUniqueKey).css("font-weight", this.textFontType);
                    $("#content-" + _this.playlistContentUniqueKey).css("font-family", this.textFontFamily);
                    $("#content-" + _this.playlistContentUniqueKey).css("background-color", this.backgroundColor);
                    $("#content-" + _this.playlistContentUniqueKey).css("color", this.textColor);
                    $("#content-" + _this.playlistContentUniqueKey).css("font-size", this.textSizePixels + "px");
                    
                    _this.createMarquee(_this, false);
                } else {
                    _this.createMarquee(_this, true);
                }
            } else {
                var fontUrl = fontPath + this.textFontFamily + "." + fontExtension;

                if(webOsHardwareVersion <= "2.0") {
                    var style = document.createElement('style');
                    style.appendChild(document.createTextNode("@font-face { font-family: '" + this.textFontFamily + "'; src: url('" + fontUrl + "'); }"));
                    document.head.appendChild(style);

                    // Font-family ayarı
                    $("#content-" + _this.playlistContentUniqueKey).css("font-family", "'" + this.textFontFamily + "'");
                    $("#content-" + _this.playlistContentUniqueKey).show();
                } else {
                    var fontFace = new FontFace(this.textFontFamily, 'url(' + fontUrl + ')');

                    fontFace.load().then(function(loadedFont) {
                        document.fonts.add(loadedFont);

                        if(_this.speed === 0) {
                            _this.createMarquee(_this, false);
                        } else {
                            _this.createMarquee(_this, true);
                        }
                    }).catch(function(error) {
                        console.error('Content_ScrollText Font yüklenirken hata oluştu:', error);
                    });
                }
            }
        } else {
            // Font belirtilmemişse doğrudan marquee oluştur
            if(this.speed === 0) {
                _this.createMarquee(_this, false);
            } else {
                _this.createMarquee(_this, true);
            }
        }

        if (func) func();
    } catch (exception) {
        console.log("ERROR Content_ScrollText.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};


Content_ScrollText.prototype.createMarquee = function (_this, active) {
    var fontWeight = this.textFontType;
    var fontStyle = "normal";
    var textDecoration = "none";

    if (this.isUnderlined)
        textDecoration = "underline";

    var marqueeStyle = "font-weight:" + fontWeight + ";font-style:" + fontStyle + ";font-size:" + this.textSizePixels + "px;text-decoration:" + textDecoration + ";color:" + this.textColor + ";";

    if(active) {
        var contentArray = JSON.parse(this.value);
        result = contentArray.reduce(function(acc, item) {
            return acc + item.replace(/<\/?p>/g, ''); // <p> etiketlerini kaldır
        }, '');
        
        $("#content-" + _this.playlistContentUniqueKey).html("");
        $("#content-" + _this.playlistContentUniqueKey).html('<marquee width="100%" direction="left" scrollamount="' + this.speed + '" height="100px" style="' + marqueeStyle + '">' + result + '</marquee>');
        $("#content-" + _this.playlistContentUniqueKey).show();
    } else {
        console.log("result", result);

        $("#content-" + _this.playlistContentUniqueKey).css("font-weight", _this.textFontType);
        $("#content-" + _this.playlistContentUniqueKey).css("font-family", _this.textFontFamily);
        $("#content-" + _this.playlistContentUniqueKey).css("background-color", _this.backgroundColor);
        $("#content-" + _this.playlistContentUniqueKey).css("color", _this.textColor);
        $("#content-" + _this.playlistContentUniqueKey).css("font-size", _this.textSizePixels + "px");
        $("#content-" + _this.playlistContentUniqueKey).show();
    }
};

Content_ScrollText.prototype.deleteUIElement = function () {
    $("#content-" + this.playlistContentUniqueKey).remove();
};

Content_ScrollText.prototype.deleteContent = function () {
    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_ScrollText.prototype.generateUIElement = function () {
    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px;"></span></div>'
        .pxcFormatString(this.playlistContentUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height);
};
Content_ScrollText.prototype.generateUIElementNoSpeed = function () {
    console.log("generateUIElementNoSpeed:"+result);
    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px;"><span id="content-{0}-span" style="width:{4}px; height:{5}px; display:table-cell;">{6}</span></div>'
        .pxcFormatString(this.playlistContentUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        result);
};