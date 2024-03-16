var connection = new signalR.HubConnectionBuilder()
    //.withUrl("https://dev-01.api.ist/playerHub")
    .withUrl(("https://prod.api.ist/playerHub"))
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

    function startSignalSocket() {
        connection.start()
            .then(function() {
                Logger.sendMessage("SignalRF Connected.");
                setTimeout(function() {getPublishment();}, 1000);
                setTimeout(function() {sendSystemInfo();}, 5000);

            })
            .catch(function(err) {
                Logger.sendMessage('startSignalSocket ERROR: '+ err);
            });
    }

connection.onreconnected = function (connectionId) {
    Logger.sendMessage(connection.state === signalR.HubConnectionState.Connected);
    Logger.sendMessage("onreconnected id = ", connectionId);
    sendSystemInfo();
    setTimeout(function() {getPublishment();}, 3000);
    
};

connection.onreconnecting = function (error) {
    Logger.sendMessage('onreconnecting', error);
    Logger.sendMessage(connection.state === signalR.HubConnectionState.Reconnecting);
};

connection.onclose = function () {
    Logger.sendMessage('onclose startSignalSocket');
    startSignalSocket();
};

connection.on("TestMessage", function (data) {
    Logger.sendMessage("Gelen Mesaj ha:" + data);
});

function sendSignal(command, data) {
    Logger.sendMessage("Sending Command " + JSON.stringify(command), "");
    Logger.sendMessage("Sending JsonData: " + JSON.stringify(data), "");

    connection.invoke(command, data)
        .then(function() {
            Logger.sendMessage("Mesaj Gonderildi: "+JSON.stringify(command));
        })
        .catch(function(err) {

            Logger.sendMessage(err);

            if(checkForString(err,"getPublishment"))
            {
                sendConsoleLog("5 SN sonra tekra GETPUBLISH DENEYECEGIM");
                Logger.sendMessage("5 SN sonra tekra GETPUBLISH DENEYECEGIM");
                setTimeout(function() {getPublishment();}, 5000);
            }else if(checkForString(err,"checkPublishment"))
            {
                sendConsoleLog("5 SN sonra tekra CHECK PUBLISH DENEYECEGIM");
                Logger.sendMessage("5 SN sonra tekra CHECK PUBLISH DENEYECEGIM");
                setTimeout(function() {getLastPublishment();}, 5000);
            }else{
                Logger.sendMessage(err);
            }
        });
}

connection.on("receiveSignal", function (data) {
    Logger.sendMessage("receiveSignal:", data);
    executeReceiveCommands(data);
});

function getConnectionState() {

    Logger.sendMessage("getConnectionState connectionstate:"+connection.state);

    Logger.sendMessage("getConnectionState signalR.HubConnectionState.Connected:"+signalR.HubConnectionState.Connected);

    if(connection.state == "Reconnecting" && signalR.HubConnectionState.Connected =="Connected" && globalPublishmentControlForNet == false)
    {
        Logger.sendMessage("Cihaz baglanti deniyor:"+connection.state);
        globalPublishmentControlForNet = true;

    }else if(connection.state == "Connected" && signalR.HubConnectionState.Connected =="Connected" && globalPublishmentControlForNet == true)
    {
        Logger.sendMessage("Cihaz baglandi getPublishment :"+connection.state);
        getPublishment();
        globalPublishmentControlForNet = false;
    }else{

        Logger.sendMessage("Reset globalPublishmentControlForNet :"+connection.state);
        //globalPublishmentControlForNet = false;

    }

    if (connection.state == "Disconnected") {
        return false;
    } else {
        return true;
    }
}
function checkForString(inputString, searchString) {
    // İlgili string içinde arama yap
    var position = inputString.indexOf(searchString);

    // Eğer pozisyon -1 ise, kelime bulunamadı demektir
    if (position === -1) {
        return false;
    } else {
        return true;
    }
}