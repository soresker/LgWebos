function Content_Html(contentInfo, parentFrameObject) {
    Content_Abstractor.call(this, contentInfo, parentFrameObject);
    try {

        this.frameUniqueKey = parentFrameObject.uniqueKey;
        this.frameWidth = parentFrameObject.width;
        this.frameHeight = parentFrameObject.height;
        this.uniqueKey = contentInfo.uniqueKey;
        this.playlistContentUniqueKey = contentInfo.playlistUniqueKey + '-' + Math.floor(Math.random() * 10000); // Değişiklik burada
        this.fileUrl = contentInfo.fileUrl;
        this.fileUniqueKey = contentInfo.fileUniqueKey;
        this.name = contentInfo.name;

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
      
        var _this = this;

        Player_Ui_Creator.UIElement.appendHTML(
            "#frame-" + this.frameUniqueKey,
            this.generateUIElement()
        );

       
        var iframe = document.createElement('iframe');
        iframe.src = this.contentInfo.getTypeContentProperty('url');
        iframe.id = "#frame-" + _this.frameUniqueKey;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        console.log("Frame element iframe.id:"+ "#frame-" + _this.frameUniqueKey);

        iframe.addEventListener('click', function(event) {
            event.stopPropagation(); // Tıklamayı durdur
            event.preventDefault(); // Tıklamanın varsayılan davranışını engelle
          });

        // İlgili frame'e iframe'i ekleyin
            var frameElement = document.querySelector("#frame-" + _this.frameUniqueKey);
            if (frameElement) {
                frameElement.appendChild(iframe);
            } else {
                console.log("Frame element bulunamadı.");
            }

        if (func)
            func();
    
    } catch (exception) {

        console.log("EXCEPTION:" + exception);
        this.contentEnded();
        return;
    }
};

Content_Html.prototype.deleteUIElement = function() {

    try {
        console.log("deleteUIElement Frame element iframe.id:"+ "#frame-" + this.frameUniqueKey);

        //$("#frame-" + this.playlistContentUniqueKey).remove();
        var iframeId = "#frame-" + this.frameUniqueKey; // Silinecek iframe'in id'si
        var iframe = document.getElementById(iframeId); // İlgili iframe'i seç
        if (iframe) {
            console.log("Silindi iframe:"+iframeId);
            iframe.remove(); // İframe'i belgeden kaldır
        } else {
            console.log("Silinecek iframe bulunamadı.");
        }

        $("#content-" + this.playlistContentUniqueKey).remove();
        //$("#frame-" + this.frameUniqueKey).remove();
    } catch (exception) {
        console.log("*******WIDGET DELETEUIELEMENT ERROR");
        console.log(exception);
    }
};

Content_Html.prototype.deleteContent = function() {
    try {

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
