function Content_Weather(contentInfo, parentFrameObject) {

    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {
        this.width = contentInfo.width;
        this.height = contentInfo.height;
        this.x = contentInfo.x;
        this.y = contentInfo.y;
        this.z = contentInfo.z;

        this.weatherProperty = contentInfo.getTypeContentProperty("type");

        //console.log("Content_Weather weatherProperty :",this.weatherProperty);

        if(this.weatherProperty == "icon")
        {
            this.uniqueKey = contentInfo.fileUniqId; //buraya uniqId gelmeli
            this.data = Publisher.playerGlobalData.replace(/\\/g, '/')  + contentInfo.getTypeContentProperty("weatherValue");

        }else{
            this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
            this.textColor = contentInfo.getTypeContentProperty("color");
            this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
            this.textSizePixels = parseInt(contentInfo.getTypeContentProperty("fontSize")) || 0;
            this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
            this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");
            this.data = contentInfo.getTypeContentProperty("weatherValue"); //
        }

       //buraya kac derece oldugu ile degiscez
      
        //console.log("Content_Weather Value:",this.data);

        this.frameUniqueKey = parentFrameObject.uniqueKey;
        this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' + Math.floor(Math.random() * 10000);

    }
    catch (exception)
    {
        console.log("Content_Weather EX", + exception);
    }
}

Content_Weather.prototype = Object.create(Content_Abstractor.prototype);
Content_Weather.prototype.constructor = Content_Weather;

Content_Weather.prototype.showContent = function (func) {
    Content_Abstractor.prototype.showContent.call(this);
    
    try {

        var _this = this;
        Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());
        var fontPath = Publisher.playerGlobalData.replace(/\\/g, '/').replace("/contents/","/fonts/");
        
        if (this.weatherProperty == "icon") {
            $("#content-" + _this.playlistContentUniqueKey).css('background-image', "url('{0}')".pxcFormatString(this.data));
            $("#content-" + _this.playlistContentUniqueKey).css("background-size", "{0}px {1}px".pxcFormatString(this.width, this.height));
            $("#content-" + _this.playlistContentUniqueKey).css("background-repeat", "no-repeat");
        }
        
        if (!Tools.isEmptyString(this.backgroundColor)) {
            $("#content-" + _this.playlistContentUniqueKey).css("background-color", "{0}".pxcFormatString(this.backgroundColor));
        }

        if (!Tools.isEmptyString(this.textColor)) {
            $("#content-" + _this.playlistContentUniqueKey).css("color", "{0}".pxcFormatString(this.textColor));
        }
        if (this.textSizePixels > 0) {
            $("#content-" + _this.playlistContentUniqueKey).css("font-size", this.textSizePixels.toString()+"px");
        }

        var fontWeight = "normal";
        var fontStyle = "normal";
        var textDecoration = "none";

        $("#content-" + _this.playlistContentUniqueKey + "-span").css("font-weight", fontWeight);
        $("#content-" + _this.playlistContentUniqueKey + "-span").css("font-style", fontStyle);
        $("#content-" + _this.playlistContentUniqueKey + "-span").css("text-decoration", textDecoration);

        if (!Tools.isEmptyString(this.textHorizontalAlignment)) {
            var horizontalAlignValue = "";

            if (this.textHorizontalAlignment.toLowerCase().trim() == "center")
                horizontalAlignValue = "center";
            else if (this.textHorizontalAlignment.toLowerCase().trim() == "left")
                horizontalAlignValue = "left";
            else if (this.textHorizontalAlignment.toLowerCase().trim() == "right")
                horizontalAlignValue = "right";

            if (!Tools.isEmptyString(horizontalAlignValue)) {
                $("#content-" + _this.playlistContentUniqueKey + "-span").css("text-align", horizontalAlignValue);
            }
        }

        if (!Tools.isEmptyString(this.textVerticalAlignment)) {

            var verticalAlignValue = "";

            if (this.textVerticalAlignment.toLowerCase().trim() == "center")
                verticalAlignValue = "middle";
            else if (this.textVerticalAlignment.toLowerCase().trim() == "bottom")
                verticalAlignValue = "bottom";
            else if (this.textVerticalAlignment.toLowerCase().trim() == "top")
                verticalAlignValue = "top";

            if (!Tools.isEmptyString(verticalAlignValue)) {
               // $("#content-" + _this.playlistContentUniqueKey).css("line-height", this.parentFrameObject + "px");
                $("#content-" + _this.playlistContentUniqueKey + "-span").css("vertical-align", verticalAlignValue);
            }
        }

        if (!Tools.isEmptyString(this.textFontFamily)) {

            if(this.textFontFamily == "verdana")
            {
                console.log("Content_Weather this.textFontFamily"+this.textFontFamily);

                $("#content-" + _this.playlistContentUniqueKey).css("font-family", "{0}".pxcFormatString(this.textFontFamily));
            }
            else{

                var fontUrl = fontPath + this.textFontFamily+"."+fontExtension; // Font dosyasının yolu
                console.log("Content_Weather FONT this.value" + fontUrl);

                if(webOsHardwareVersion <= "2.0")
                {

                    var style = document.createElement('style');
                    style.appendChild(document.createTextNode("@font-face { font-family: '" + this.textFontFamily + "'; src: url('" + fontUrl + "'); }"));
                    document.head.appendChild(style);

                    // Font-family ayarı
                    $("#content-" + _this.playlistContentUniqueKey).css("font-family", "'" + this.textFontFamily + "'");
                    $("#content-" + _this.playlistContentUniqueKey).show();

                }else{

                    var fontFace = new FontFace(this.textFontFamily, 'url(' + fontUrl + ')'); // FontFace nesnesi oluştur
                    var self = this; // Kapsayıcı alanı fonksiyon içinde kullanmak için bir referans
                    
                    // Font yükleme işlemi tamamlandığında
                    fontFace.load().then(function(loadedFont) {
                        document.fonts.add(loadedFont); // Font'u belgeye ekle
                        console.log("Content_Weather FONT loaddded" + fontUrl);
                        $("#content-" + self.frameUniqueKey + "-span").css("font-family", "'" + self.textFontFamily + "'");
                        $("#content-" + self.frameUniqueKey).show();
    
                    }).catch(function(error) {
                        console.error('Content_Weather Font yüklenirken hata oluştu:', error);
                    });

                }
                
            }    
       
        }
        
        $("#content-" + _this.playlistContentUniqueKey).show();

        if (func)
        func();
            
    } catch (exception) {

        console.log("ERROR Content_Weather.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};


Content_Weather.prototype.deleteUIElement = function () {
    $("#content-" + this.playlistContentUniqueKey).remove();
};

Content_Weather.prototype.deleteContent = function () {

    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_Weather.prototype.generateUIElement = function () {

    this.value = this.data;

    if(this.weatherProperty == "icon")
        return '<div id="content-{0}" class="playing-platform-content playing-common-content-image" style="z-index:{1};width:{2}px; height:{3}px;"></div>'.pxcFormatString(this.playlistContentUniqueKey, Tools.defaultValue(this.z, 0), this.width, this.height);   
    else
        return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px; display:table-cell;">{6}</span></div>'
        .pxcFormatString(this.playlistContentUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        this.value);
};

