var connection = new signalR.HubConnectionBuilder()
	.withUrl(("http://device.apiteknoloji.com.tr/playerHub"))
	.configureLogging(signalR.LogLevel.Information)
	.withAutomaticReconnect()
	.build();

    async function startSignalSocket() {
        try {
            await connection.start();
            _log("SignalRF Connected.");
        } catch (err) {
            _log('startSignalSocket', err)
        }
    };
    
    connection.onreconnected(connectionId => {
        _log(connection.state === signalR.HubConnectionState.Connected);
        _log("onreconnected id = ", connectionId);
    });
    
    connection.onreconnecting(error => {
        _log(connection.state === signalR.HubConnectionState.Reconnecting);
    });
    
    connection.onclose(async () => {
        await start();
    });
    
    connection.on("TestMessage", data => {
        _log("Gelen Mesaj ha:" + data);
    });
    
    async function sendSignal(command, data) {
        _log("Sending Command:", command);
        _log("Sending JsonData:", data);
    
        try {
            await connection.invoke(command, data);
        } catch (err) {
            _log(err);
        }
    };
    
    connection.on("receiveSignal", data => {
        _log("receiveSignal:", data);
        //console.info("receiveSignal",data);
        //let result = tool.checkCommands(data, sendSettings);
        _log("checkCommands:", result);
        //executeReceiveCommands(data);
    
    });