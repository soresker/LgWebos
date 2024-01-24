function Play_Playlist(playlistInfo) {


    console.log("Play_Playlist - PLAYLIST");

    this.playlistInfo = playlistInfo;
    
    this.id = playlistInfo.id;
    this.name = playlistInfo.name;
    this.duration = playlistInfo.duration;
    this.findKey = playlistInfo.findKey;
    this.contentIndex = 0;

    this.currentContent = 0;
    this.previousContent = 0;
    this.singleShotTimer = 0;
    this.stopPlaylistOperations = false;

    Player_Ui_Creator.UIElement.appendHTML("body", this.generateUIElement());
    console.log("Play_Playlist - END");

}

Play_Playlist.prototype.generateUIElement = function() {
    return '<div id="playlist-{0}" style="width:100%; height:100%;" class="playing-platform-playlist" style="top:{1}px;left:{2}px;z-index:{3}; width:{4}px; height:{5}px;"></div>'.pxcFormatString(this.findKey, this.y, this.x, Tools.defaultValue(this.z, 0), this.width, this.height);
};

Play_Playlist.prototype.continuePlaylist = function() {

    console.log("CONTINUE PLAYLIST - PLAYLIST");

    if (this.stopPlaylistOperations) return;

    var validContentCount = 0;

    for (var i = 0; i < this.playlistInfo.contentInfoList.length; i++) {

        var contentInfo = this.playlistInfo.contentInfoList[i];

        if (contentInfo.isValid) {

            validContentCount++;
        }
    }

    if (validContentCount == 0) {

        this.stopPlaylistOperations = true;
        if (this.currentContent) {

            this.deleteCurrentContent();

        }
        return;
    }


    this.contentIndex++;
    if (this.contentIndex >= this.playlistInfo.contentInfoList.length) {
        this.contentIndex = 0;
    }
    this.playNextContent();
};

Play_Playlist.prototype.deletePlaylist = function() {

    if (this.singleShotTimer != 0) {
        clearTimeout(this.singleShotTimer);
    }
    this.deleteCurrentContent();
    this.deletePreviousContent();

    $("#playlist-" + this.findKey).remove();

    this.playlistInfo = 0;
}

Play_Playlist.prototype.playNextContent = function() {

    console.log("PLAY NEXT CONTENT");

    if (this.playlistInfo.contentInfoList.length == 0) {
        return;
    }
    try {
        if (this.currentContent != 0) {

            this.deleteCurrentContent();

        } else {
            this.previousContent = this.currentContent;
        }


        var contentInfo = this.playlistInfo.contentInfoList[this.contentIndex];
        switch (contentInfo.type) {


            case "unknown":
                break;
            case "video":
                {
                this.currentContent = new Content_Video(contentInfo, this);
                }
                break;
            case "image":
                this.currentContent = new Content_Image(contentInfo, this);
                break;

            default:
                break;
        }

        if (this.currentContent) {
            this.currentContent.showContent();
        }

    } catch (error) {
        console.log("error:" + error.stack);
    }
};

Play_Playlist.prototype.deletePreviousContent = function() {

    if (this.previousContent) {


        if (this.previousContent.mainTimer) {
            clearTimeout(this.previousContent.mainTimer);
        }
        this.previousContent.deleteContent();
        this.previousContent = null;
    }

}

Play_Playlist.prototype.deleteCurrentContent = function() {

    if (this.currentContent) {
        try {

            if (this.currentContent.mainTimer) {
                clearTimeout(this.currentContent.mainTimer);
            }

            this.currentContent.deleteContent();
            this.currentContent = null;
        } catch (error) {
            console.log("deleteCurrentContent: error" + error.stack);

        }
    }
};

Play_Playlist.prototype.startPlaylist = function() {


    this.contentIndex = 0;
    this.playNextContent();
};


Play_Playlist.prototype.setContentAnimations = function() {

    if (!this.previousContent)
        return;

    var _this = this;
    var $active = $("#content-" + this.previousContent.playlistContentUniqueKey);
    var $next = $("#content-" + this.currentContent.playlistContentUniqueKey);
    $next.css('z-index', 2);
    $active.fadeOut(1000, function() {
        $active.css('z-index', 1).show().removeClass('active');
        $next.css('z-index', 3).addClass('active');
        _this.animationCompleted(_this);
    });
};



Play_Playlist.prototype.animationCompleted = function(context) {
    context.deletePreviousContent();
}