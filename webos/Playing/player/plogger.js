function Logger() {}

Logger.sendMessage = function (content, status) {
    Start_Handler.sendLog(content, 'Info');
}
