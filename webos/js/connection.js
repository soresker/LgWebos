var connection = new signalR.HubConnectionBuilder()
    .withUrl("https://dev-01.api.ist/playerHub")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

function startSignalSocket() {
    try {
        connection.start();
        Logger.sendMessage("SignalRF Connected.");
    } catch (err) {
        Logger.sendMessage('startSignalSocket', err);
    }
}

connection.onreconnected = function (connectionId) {
    Logger.sendMessage(connection.state === signalR.HubConnectionState.Connected);
    Logger.sendMessage("onreconnected id = ", connectionId);
};

connection.onreconnecting = function (error) {
    Logger.sendMessage(connection.state === signalR.HubConnectionState.Reconnecting);
};

connection.onclose = function () {
    startSignalSocket();
};

connection.on("TestMessage", function (data) {
    Logger.sendMessage("Gelen Mesaj ha:" + data);
});

function sendSignal(command, data) {
    Logger.sendMessage("Sending Command "+JSON.stringify(command), "");
    Logger.sendMessage("Sending JsonData:"+JSON.stringify(data), "");

    try {
        connection.invoke(command, data);
    } catch (err) {
        Logger.sendMessage(err);
    }
}

connection.on("receiveSignal", function (data) {
    Logger.sendMessage("receiveSignal:", data);
    executeReceiveCommands(data);
});
