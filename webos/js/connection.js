var connection = new signalR.HubConnectionBuilder()
    .withUrl("http://device.apiteknoloji.com.tr/playerHub")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build();

function startSignalSocket() {
    try {
        connection.start();
        _log("SignalRF Connected.");
    } catch (err) {
        _log('startSignalSocket', err);
    }
}

connection.onreconnected = function (connectionId) {
    _log(connection.state === signalR.HubConnectionState.Connected);
    _log("onreconnected id = ", connectionId);
};

connection.onreconnecting = function (error) {
    _log(connection.state === signalR.HubConnectionState.Reconnecting);
};

connection.onclose = function () {
    startSignalSocket();
};

connection.on("TestMessage", function (data) {
    _log("Gelen Mesaj ha:" + data);
});

function sendSignal(command, data) {
    _log("Sending Command:", command);
    _log("Sending JsonData:", data);

    try {
        connection.invoke(command, data);
    } catch (err) {
        _log(err);
    }
}

connection.on("receiveSignal", function (data) {
    _log("receiveSignal:", data);
    executeReceiveCommands(data);
});
