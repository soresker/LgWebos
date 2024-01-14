class Logger {

    static sendMessage =  function(content, status) {

        Start_Handler.sendLog(content, 'Info');
    }
}
if (typeof module !== 'undefined') module.exports = { Logger };
