function Logger (){

    Logger.prototype.sendMessage =  function(content, status) {

        Start_Handler.sendLog(content, 'Info');
    }
}
