var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('node-uuid');

app.get('/', function (req, res){
    res.sendFile(__dirname + '/client.html');
});
app.get('/jquery.js', function (req, res) {
    res.sendFile(__dirname + '/js/jquery.min.js');
});
app.get('/bootstrap.min.css', function (req, res){
    res.sendFile(__dirname + '/bootstrap/css/bootstrap.min.css');
});
app.get('/bootstrap.min.js', function (req, res){
    res.sendFile(__dirname + '/bootstrap/js/bootstrap.min.js');
});

http.listen(3000, function (){
    console.log('listening on *:3000');
});
function wsSend(type, client_uuid, nickname, message) {
    io.emit(type, JSON.stringify({
        "type": type,
        "id": client_uuid,
        "nickname": nickname,
        "message": message
    }));
}
var clientIndex = 1;
var clients = [];
io.on('connection', function (socket){
    var client_uuid = uuid.v4();
    var nickname = "SUser" + clientIndex;
    clientIndex += 1;
    clients.push({ "id": client_uuid, "nickname": nickname });
    console.log('client [%s] connected', client_uuid);
    var connect_message = nickname + " has connected";
    wsSend("notification", client_uuid, nickname, connect_message);
    console.log('client [%s] connected', client_uuid);
    socket.on('message', function (message) {
        console.log(message);
        wsSend("message", client_uuid, nickname, message);

    });
    socket.on('nick_c', function (nick){
        var old_nickname = nickname;
        nickname = nick;
        var nickname_message = "Client " + old_nickname + " changed to " + nickname;
        wsSend("nick_update", client_uuid, nickname, nickname_message);
    });
    var closeSocket = function (customMessage) {
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id == client_uuid) {
                var disconnect_message;
                if (customMessage) {
                    disconnect_message = customMessage;
                } else {
                    disconnect_message = nickname + " has disconnected";
                }
                wsSend("notification", client_uuid, nickname, disconnect_message);
                clients.splice(i, 1);
            }
        }
    };
    socket.on('disconnect', function () {
        closeSocket();
    });
    process.on('SIGINT', function () {
        console.log("Closing things");
        closeSocket('Server has disconnected');
        process.exit();
    });
});
