var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const serverNamespace = io.of('/server');
const clientNamespace = io.of('/client');

let lobbyPlayers = [];

app.get('/', function (req, res) {
      console.log('dir: /');
      res.sendFile(__dirname + '/html/index.html');
});

<<<<<<< HEAD
app.get('/image', function (req, res) {
=======
app.get('/image', function (req, res){
>>>>>>> 9ef8e2c423baacf97936f6d9ffd621f7d01c7a27
      console.log('Sending Image');
      res.sendFile(__dirname + '/image.png');
})

clientNamespace.on('connection', function (socket) {

      console.log('Client connected');

      lobbyPlayers.push({ clientId: socket.id });

      // Tell server about new player
      serverNamespace.emit('PlayerJoined', { clientId: socket.id });

      // Tell server about new Virtual Controller Input
      socket.on('VirtualControllerUpdate', function (data) {
            data.clientId = socket.id;
            serverNamespace.emit('VirtualControllerUpdate', data);
      });

      // Tell server about new Virtual Controller Input
      socket.on('VirtualButtonUpdate', function (data) {
            data.clientId = socket.id;
            serverNamespace.emit('VirtualButtonUpdate', data);
            console.log(data);
      });

      socket.on('disconnect', function () {
            console.log('Client disconnected');

            // Remove player from array
            lobbyPlayers = lobbyPlayers.filter((value, index, array) => {
                  return !(value.clientId == socket.id);
            });
      });

});

serverNamespace.on('connection', function (socket) {
      console.log('Server connected');

      socket.on('disconnect', function () {
            clientNamespace.emit('ServerDisconnected');
            console.log('Server disconnected');
      });

      socket.on('GetPlayers', (data, cb) => {
            cb(lobbyPlayers);
      });

      socket.on('Ping', (data, cb) => {
            cb(200);
      });

      socket.on('image', (data) => {
            console.log(data);
            clientNamespace.emit('image', data.image);
      })

      socket.on('NewHUDLayout', function (data) {
            console.log(data);
            if (data.HUDElements) {
                  // TODO: Data validation (not needed for the prototype)
                  clientNamespace.emit('NewHUDLayout', data);
            }
      });

      socket.on('UpdateHUDElement', (data) => {
            clientNamespace.emit('UpdateHUDElement', data);
      });

      socket.on('Vibrate', (data) => {
            clientNamespace.emit('Vibrate', data);
      });

      socket.on('Speak', (data) => {
            clientNamespace.emit('Speak', data);
      });

      socket.on('CustomPlayerCommand', function (data) {
            console.log(data);
            // TODO: Data validation (not needed for the prototype)
            for (const playerClientId of data.recipientPlayers) {
                  clientNamespace.to(`${playerClientId}`).emit(data.eventName, data.data);
            }
      });
});

const PORT = 4321;

http.listen(PORT, function () {
      console.log('listening on *:' + PORT);
});