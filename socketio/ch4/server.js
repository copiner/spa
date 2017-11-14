var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//静态资源路径
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.get('/jquery.min.js', function (req, res) {
    res.sendFile(__dirname + '/js/jquery.min.js');
});
app.get('/index.css', function (req, res) {
    res.sendFile(__dirname + '/css/index.css');
});

io.on('connection', function (socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        console.log("msg:" + msg);
        io.emit('chat message', msg);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
