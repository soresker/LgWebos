function Start_Handler () {

    Start_Handler.prototype.receiveMessage = function(msg) {
        msg = JSON.parse(msg);
        console.log("Start_Handler receiveMessage:",msg.MessageType);
        console.log("Start_Handler receiveMessage:",msg.Data);

        switch (msg.MessageType) {
            case "initPlayer":
                Publisher.setGlobalData(JSON.stringify(msg.Data), msg.Callback);
                break;
            case "startPublishment":
                Publisher.newPublishment(JSON.stringify(msg.Data), msg.Callback);
                break;    
            case "publishmentDelete":
                Tools.showLogo();
                break;
            case "currencyData":
                Publisher.setCurrencyData(JSON.stringify(msg.Data), msg.Callback);
                break;   
            default:
                break;
        }
    },
    Start_Handler.prototype.sendLog = function(message, type) {
        var logging = {};
        logging.Type = "playingLog";
        logging.Message = message;
        logging.LogType = type;
        window.parent.postMessage(JSON.stringify(logging));
    }

}