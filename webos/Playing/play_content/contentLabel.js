function Content_Label(contentInfo, parentFrameObject) {

    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {
        this.width = parentFrameObject.width;
        this.height = parentFrameObject.height;
        this.x = 0;
        this.y = 0;
        this.refreshTimer = 0;
        this.isCurrentDtSet = false;
        this.currentDtPending = false;
        this.timerCurrentDt = 0;


        this.value = contentInfo.getTypeContentProperty("value");
        this.backgroundColor = contentInfo.getTypeContentProperty("backgroundColor");
        this.textColor = contentInfo.getTypeContentProperty("color");
        this.textFontFamily = contentInfo.getTypeContentProperty("fontFamily");
        this.textSizePixels = parseInt(contentInfo.getTypeContentProperty("fontSize")) || 0;
        this.textHorizontalAlignment = contentInfo.getTypeContentProperty("align");
        this.textVerticalAlignment = contentInfo.getTypeContentProperty("verticalAlign");

        this.isCurrency = contentInfo.getTypeContentProperty("isCurrency");
        this.isMap = contentInfo.getTypeContentProperty("isMap");
        this.data = contentInfo.getTypeContentProperty("data");
        this.latitude = contentInfo.getTypeContentProperty("latitude");
        this.longitude = contentInfo.getTypeContentProperty("longitude");
        this.zoom = contentInfo.getTypeContentProperty("zoom");
        this.map = 0;
        this.actualProvider = 0;

        if(contentInfo.name == "usd")
        this.data = Publisher.currencyValues.usd;
        if(contentInfo.name == "euro")
        this.data = Publisher.currencyValues.euro;

        console.log("isCurrency",this.isCurrency);
        console.log("data",this.data);

        console.log("isMap",this.isMap);
        console.log("latitude",this.latitude);

        this.frameUniqueKey = parentFrameObject.uniqueKey;

    }
    catch (exception)
    {
        console.log("Content_Label EX", + exception);
    }
}

Content_Label.prototype = Object.create(Content_Abstractor.prototype);
Content_Label.prototype.constructor = Content_Label;

Content_Label.prototype.showContent = function () {

    Content_Abstractor.prototype.showContent.call(this);
    
    try {

        
        if(this.isMap == "1" )
        {
        /*    
            var mapId = "content-{0}".pxcFormatString(this.frameUniqueKey);
            Player_Ui_Creator.UIElement.appendHTML("#frame-" + this.frameUniqueKey, this.generateUIElement());

            ymaps.ready(function () {
                console.log("HAZIRRRRrrrrrrrrrrrrrr");

        var myMap = new ymaps.Map(mapId, {
            center: [41.06, 28.52],
            zoom: 10,
            controls: []
        });

    // Creating the "Traffic" control.
    var trafficControl = new ymaps.control.TrafficControl({ state: {
            // Displaying traffic "Now".
            providerKey: 'traffic#actual',
            // Begin immediately showing traffic on the map.
            trafficShown: true
        }});
    // Adding the control to the map.
    myMap.controls.add(trafficControl);
    // Getting a reference to the "Now" traffic provider and enabling the display of information points.
    trafficControl.getProvider('traffic#actual').state.set('infoLayerShown', true);  
    /*
            this.map = myMap;   
            this.map.behaviors.get('drag').disable();
            this.map.behaviors.get('dblClickZoom').disable();
            this.map.behaviors.get('multiTouch').disable();
            this.map.behaviors.get('rightMouseButtonMagnifier').disable();
            this.map.behaviors.get('leftMouseButtonMagnifier').disable();
            this.map.behaviors.get('ruler').disable();
            this.map.behaviors.get('routeEditor').disable();
        
            this.map.controls.remove('zoomControl');
            this.map.controls.remove('searchControl');
            this.map.controls.remove('trafficControl');
            this.map.controls.remove('toolBar');

            if (this.actualProvider === 0) {
                this.actualProvider = new ymaps.traffic.provider.Actual({}, { infoLayerShown: true });
                this.actualProvider.setMap(this.map);
            }
            else
                this.actualProvider.setMap(this.map);
        
            // We will not allow displaying balloons when the layer of traffic and infopoints is clicked.
            this.map.layers.options.set({
                // The option name is formed from the hotspot layer option    // 'openBalloonOnClick' by adding the 'trafficJam' prefix.
                trafficJamOpenBalloonOnClick: false,
                // The option name for the infopoint layer is formed the same way.
                trafficInfoOpenBalloonOnClick: false
            });
            
            if (this.showLabel == true) {
                var placemark = new ymaps.Placemark([this.latitude, this.longitude], { iconContent: '<div style="margin-left:10px;width:200px;padding:3px;background-color:rgba(255, 255, 255, 0.5);color:rgba(' + this.color + ');font-size:' + this.fontSize + 'px; font-weight:' + textFontWeight + '; font-style:' + textFontStyle + '; text-decoration:' + textTextDecoration+';"><strong>' + this.label + '</strong></div>' });
                this.map.geoObjects.add(placemark);
            }
   
            $("#content-" + this.frameUniqueKey).show();
            
         });
            */
        } else{


            if (!Tools.isEmptyString(this.backgroundColor)) {
                $("#content-" + this.frameUniqueKey).css("background-color", "rgba({0})".pxcFormatString(this.backgroundColor));
            }
    
            if (!Tools.isEmptyString(this.textColor)) {
                $("#content-" + this.frameUniqueKey).css("color", "rgba({0})".pxcFormatString(this.textColor));
            }
    
            if (!Tools.isEmptyString(this.textFontFamily)) {
                $("#content-" + this.frameUniqueKey).css("font-family", "{0}".pxcFormatString(this.textFontFamily));
            }
    
            if (this.textSizePixels > 0) {
                $("#content-" + this.frameUniqueKey).css("font-size", this.textSizePixels);
            }
    
            if (!Tools.isEmptyString(this.textHorizontalAlignment)) {
                var horizontalAlignValue = "";
    
                if (this.textHorizontalAlignment.toLowerCase().trim() == "center")
                    horizontalAlignValue = "center";
                else if (this.textHorizontalAlignment.toLowerCase().trim() == "left")
                    horizontalAlignValue = "left";
                else if (this.textHorizontalAlignment.toLowerCase().trim() == "right")
                    horizontalAlignValue = "right";
    
                if (!Tools.isEmptyString(horizontalAlignValue)) {
                    $("#content-" + this.frameUniqueKey + "-span").css("text-align", horizontalAlignValue);
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
                   // $("#content-" + this.frameUniqueKey).css("line-height", this.parentFrameObject + "px");
                    $("#content-" + this.frameUniqueKey + "-span").css("vertical-align", verticalAlignValue);
                }
            }
    
            var fontWeight = "normal";
            var fontStyle = "normal";
            var textDecoration = "none";
    
            if (this.isBold)
                fontWeight = "bold";
    
            if (this.isItalic)
                fontStyle = "italic";
    
            if (this.isUnderlined)
                textDecoration = "underline";
    
            $("#content-" + this.frameUniqueKey + "-span").css("font-weight", fontWeight);
            $("#content-" + this.frameUniqueKey + "-span").css("font-style", fontStyle);
            $("#content-" + this.frameUniqueKey + "-span").css("text-decoration", textDecoration);
    
            $("#content-" + this.frameUniqueKey).show();

        }
       
    } catch (exception) {

        console.log("Content_Label.ShowContent", exception);
        this.parentFrameObject.setCurrentContentValidity(false);
        this.contentEnded();
        return;
    }
};

Content_Label.prototype.deleteUIElement = function () {
    $("#content-" + this.frameUniqueKey).remove();
};

Content_Label.prototype.deleteContent = function () {

    this.deleteUIElement();
    Content_Abstractor.prototype.deleteContent.call(this);
};

Content_Label.prototype.generateUIElement = function () {

    if(this.isCurrency == "1")
    {
        this.value = this.data;
    }else if(this.isMap == "1"){
        return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"></div>'
        .pxcFormatString(this.frameUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        this.value);
    }else{

    }

    return '<div id="content-{0}" class="playing-platform-content playing-common-content-datetime" style="top:{1}px;left:{2}px;z-index:{3};width:{4}px; height:{5}px; position: absolute;"><span id="content-{0}-span" style="width:{4}px; height:{5}px; display:table-cell;">{6}</span></div>'
        .pxcFormatString(this.frameUniqueKey,
        this.y,
        this.x,
        Tools.defaultValue(this.z, 0),
        this.width,
        this.height,
        this.value);
};

