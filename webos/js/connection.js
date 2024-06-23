var hubUrl = "https://prod.api.ist/playerHub";
//var hubUrl = "https://dev-01.api.ist/playerHub";
//var hubUrl = "http://signagedevice.kansaialtan.com.tr/playerHub";
var backoffTimes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
var connection;
var reconnectTimeout;
var globalPublishmentControlForNet = false;

function startSignalSocket() {

    if (connection) {
        connection.stop();
    }
    
    connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .configureLogging(signalR.LogLevel.Information)
      //  .withAutomaticReconnect()
        .build();

    connection.start()
        .then(function() {
            Logger.sendMessage("SignalRF Connected.");
            setTimeout(function() { sendSystemInfo(); }, 3000);
            setTimeout(function() { getPublishmentDownload(); }, 7000);
        })
        .catch(function(err) {
            Logger.sendMessage('startSignalSocket ERROR: ' + err);
            // Bağlantı hatası olduğunda geri bağlanmayı deneyin
            scheduleReconnect();
        });

    connection.onreconnected = function(connectionId) {
        Logger.sendMessage(connection.state === signalR.HubConnectionState.Connected);
        Logger.sendMessage("onreconnected id = ", connectionId);
        sendSystemInfo();
        setTimeout(function() { getPublishmentDownload(); }, 3000);
    };

    connection.onreconnecting = function(error) {
        Logger.sendMessage('onreconnecting', error);
        Logger.sendMessage(connection.state === signalR.HubConnectionState.Reconnecting);
    };

    connection.onclose = function() {
        Logger.sendMessage('onclose startSignalSocket');
        // Bağlantı kapandığında geri bağlanmayı deneyin
        scheduleReconnect();
    };

    connection.on("TestMessage", function(data) {
        Logger.sendMessage("Gelen Mesaj ha:" + data);
    });

    connection.on("receiveSignal", function(data) {
        Logger.sendMessage("receiveSignal:", data);
        executeReceiveCommands(data);
    });
}

function scheduleReconnect() {
    // Önceki zamanlayıcıyı temizleyin
    clearTimeout(reconnectTimeout);

    // Exponential Backoff ile yeniden bağlanmayı planlayın
    var delayTime = backoffTimes.shift() * 1000; // ms cinsinden
    reconnectTimeout = setTimeout(function() {
        Logger.sendMessage("Reconnecting...");
        startSignalSocket();
    }, delayTime);

    // Geri kalan zamanlayıcıları iptal etmek için kontrol edin
    for (var i = 0; i < backoffTimes.length; i++) {
        clearTimeout(backoffTimes[i]);
    }
}

function checkForString(inputString, searchString) {
    if (typeof inputString !== 'string') {
        return false;
    }

    var position = inputString.indexOf(searchString);

    if (position === -1) {
        return false;
    } else {
        return true;
    }
}

function sendSignal(command, data) {
    Logger.sendMessage("Sending Command " + JSON.stringify(command), "");
    Logger.sendMessage("Sending JsonData: " + JSON.stringify(data), "");

    connection.invoke(command, data)
        .then(function() {
            Logger.sendMessage("Mesaj Gonderildi: " + JSON.stringify(command));
        })
        .catch(function(err) {
            Logger.sendMessage(err);

            if (err.message.includes("Failed to invoke 'updatePublishmentDate'")) {
                Logger.sendMessage("TEKRAR DENIYORUZ updatePublishmentDate");
                setTimeout(function() {updatePublishmentDate();}, 10000); 
              }
              if (err.message.includes("Failed to invoke 'getPublishment'")) {
                Logger.sendMessage("TEKRAR DENIYORUZ getPublishment");
                setTimeout(function() {getPublishmentDownload();}, 10000); 
              }
              if (err.message.includes("Failed to invoke 'systeminfo'")) {
                Logger.sendMessage("TEKRAR DENIYORUZ systeminfo");
                setTimeout(function() {sendSystemInfo();}, 10000); 
              }

        });
}

function getConnectionState() {
    Logger.sendMessage("getConnectionState connectionstate:" + connection.state);
    Logger.sendMessage("getConnectionState signalR.HubConnectionState.Connected:" + signalR.HubConnectionState.Connected);

    if (connection.state == "Reconnecting" && signalR.HubConnectionState.Connected == "Connected" && globalPublishmentControlForNet == false) {
        Logger.sendMessage("Cihaz baglanti deniyor:" + connection.state);
        globalPublishmentControlForNet = true;
    } else if (connection.state == "Connected" && signalR.HubConnectionState.Connected == "Connected" && globalPublishmentControlForNet == true) {
        Logger.sendMessage("Cihaz baglandi getPublishment :" + connection.state);
        getPublishmentDownload();
        globalPublishmentControlForNet = false;
        
    } else {
        Logger.sendMessage("Reset globalPublishmentControlForNet :" + connection.state);
    }

    if (connection.state == "Disconnected" || connection.state == "Reconnecting") {
        return false;
    } else {
        return true;
    }
}

