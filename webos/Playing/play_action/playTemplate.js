function Play_Template () {

    this.name = "";
    this.duration = 0;
    this.uniqueKey = ""; //undefined düzelt akin
    this.width = 0; 
    this.height = 0; //manuel verildi düzeltilecek
}

Play_Template.prototype.startTemplate = function(templateInfo) {

    this.name = templateInfo.name;
    this.duration = templateInfo.duration;
    this.uniqueKey = templateInfo.templateUniqId; //undefined düzelt akin
    this.width = templateInfo.width; 
    this.height = templateInfo.height; //manuel verildi düzeltilecek
    this.position = templateInfo.position;
  
    console.log("Play_Template name: " +templateInfo.name ,'Info');
    console.log("Play_Template duration: " +templateInfo.duration ,'Info');
    console.log("Play_Template uniqueKey: " +this.uniqueKey ,'Info');
    console.log("Play_Template width: " +templateInfo.width ,'Info');
    console.log("Play_Template height: " +templateInfo.height ,'Info');
    console.log("Play_Template position: " +templateInfo.position ,'Info');

    console.log("templateInfo.frameInfoList.lengtht: " +templateInfo.frameInfoList.length ,'Info');

    $(".pixage-platform-template").remove();
    Player_Ui_Creator.UIElement.appendHTML("body", this.generateUIElement());
    
    this.frameList = [];

    for (var i = 0; i < templateInfo.frameInfoList.length; i++) {
        var newPlaylistInfoList = [];
        for (var y = 0; y < templateInfo.frameInfoList[i].playlistInfoList.length; y++) {
            if (templateInfo.frameInfoList[i].playlistInfoList[y].contentInfoList.length > 0)
                newPlaylistInfoList.push(templateInfo.frameInfoList[i].playlistInfoList[y]);
        }
        templateInfo.frameInfoList[i].playlistInfoList = newPlaylistInfoList;
    }

    for (var frameInfoKey in templateInfo.frameInfoList) {
        var frameInfo = templateInfo.frameInfoList[frameInfoKey];
        console.log("Template6", "Creating new Frame Widget. Frame Id:{0}".pxcFormatString(frameInfo.id));
        frameInfo.templateUniqueKey = this.uniqueKey;
        var newFrame = new Play_Frame(frameInfo, this);
        this.frameList.push(newFrame);
    }

    this.startAllFrames();

    console.log("Template:{0}. Starting all frames.".pxcFormatString(this.uniqueKey));

};

Play_Template.prototype.deleteTemplate = function() {


    for (var i = 0; i < this.frameList.length; i++) {

        this.frameList[i].deleteFrame();

    }

    this.frameList = [];


};

Play_Template.prototype.generateUIElement = function() {
    return '<div id="template-{0}" class="playing-platform-template"style="width:{1}px; height:{2}px; position:{3};"></div>'.pxcFormatString(this.uniqueKey, this.width, this.height,this.position);
};


Play_Template.prototype.clearFrameList = function() {

    this.frameList = [];

};


Play_Template.prototype.addToFrameList = function(frame) {

    this.frameList.push(frame);

};

Play_Template.prototype.startAllFrames = function() {

    console.log("startAllFrames  this.frameList.length: " +this.frameList.length ,'Info');

    for (var i = 0; i < this.frameList.length; i++) {

        this.frameList[i].startFrame();

    }

};

