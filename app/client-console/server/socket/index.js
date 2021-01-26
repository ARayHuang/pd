// Delete after socket is ready
const express = require('express');
const http = require('http');
const socketServer = require('socket.io');
const app = express();
const server = http.createServer(app);
const socketIO = socketServer(server);

server.listen(3005, () => {
	console.log('Socket server running...');
});

const connections = [];

socketIO.on('connection', function (socket) {
	console.log('connected to socket server');

	connections.push(socket);

	// Add test socket here
	// socket.on('XXX', message => {
	// do something...
	// socketIO.emit('YYY', comments);
	// });
});
