var DEBUG_FLAG = true;
var sync_port = 14726;

/**
 * webOS Service
 */
var Service = require('webos-service');
var service = new Service("com.lg.app.signage.server");

/**
 * NPM modules
 */
var WebSocketServer = require('websocket').server;
var http = require('http');
var url = require("url");
var qs = require('querystring');

/**
 * Port define
 */
var clients = [];

var logs = [];

var server = null;

function openWebSocketServer() {
    server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end(JSON.stringify(logs, null, 4));
    });
    
    server.listen(sync_port);
    
    var wsServer = new WebSocketServer({
        httpServer: server
    });
    
    wsServer.on('request', function (request) {
        var connection = request.accept(null, request.origin);
        var query = request.resourceURL.query;
        console.log(JSON.stringify(query));
        /*
        message.respond({
            returnValue : false,
            message : JSON.stringify(query)
        });
*/
        MessageSendMaster({
            c: "sync_begin",
        });

        if (clients.findIndex(x => x.dsID == query["playerID"]) == -1) {
    
            var syncClient = {
                dsID: query["playerID"],
                socket: connection,
                role: query.role
    
            };
    
            if (query.role == "master") {
                console.log(`Synchronous master client connected. dsID : ${query["playerID"]}`, "success");
    
                syncClient.socket.on('message', function (msg) {
                    var m = JSON.parse(msg.utf8Data);
                    console.log(JSON.stringify(m));
                    switch (m.cmd) {
                        case "begin":
                            beginSync = true;
                            clients.forEach((cli) => {
                                cli.socket.send(JSON.stringify({
                                    c: "sync_begin"
                                }));
                            });
                            break;
                        case "video_set_time":
                            /*MessageSendSlave({
                                 c: "sync_video_time",
                                 data: m.data
                             }); 
                             */   
                             clients.forEach((cli) => {
                                cli.socket.send(JSON.stringify({
                                    c: "sync_video_time",
                                    data: m.data
                                }));
                            });
                                                       
                            break;
                    }
                });
            } else if (query.role == "slave") {
                console.log(`Synchronous slave client connected. dsID : ${query["playerID"]}`, "success");
            
                    syncClient.socket.on('message', (msg) => {
                    var m = JSON.parse(msg.utf8Data);
                    console.log(JSON.stringify(m));
    
                    switch (m.cmd) {
                        case "begin":
                            MessageSendMaster({
                                c: "sync_begin",
                                data: m.data
                            });
                            break;
                        case "video_set_time":
                            MessageSendSlave({
                                c: "sync_video_time",
                                data: m.data
                            });
                            break;    
                    }
                });
            }
            clients.push(syncClient);
        }
    
        connection.on('close', function () {
            console.log("[DISCONNECT] " + query["playerID"]);
    
        })
    });
}

function MessageSendSlave(m) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].role === "slave") {
            clients[i].socket.send(JSON.stringify(m));
        }
    }
}

function MessageSendMaster(m) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].role === "master") {
            clients[i].socket.send(JSON.stringify(m));
        }
    }
}

service.register('serverOn', function(message) {
    try {
        if (server !== null) {
            message.respond({
                returnValue: false,
                errorCode: 'SERVER_ALREADY_OPENED',
                errorText: 'Server already opened'
            });
        } else {
            console.log("CopenWebSocketServer... :" );

            openWebSocketServer();
            message.respond({
                returnValue : true
            });
        }
    } catch(err) {
        console.log("CopenWebSocketServer... :");
        openWebSocketServer();
        message.respond({
            returnValue : false,
            errorCode : 'NO_SERVER',
            errorText : 'Cannot run server'
        });

    }
});