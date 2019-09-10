const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(3000, '127.0.0.1', () => {
    console.log("Server running at http://127.0.0.1:3000");
});

app.use('/assets', express.static('assets'));
app.get('/messages', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

let users = new Map(); // socket : username
let connections = []; // array of connections at this moment

io.sockets.on('connection', (socket) => {
    console.log('Connected');
    connections.push(socket);

    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        users.delete(socket);
        console.log("Disconnected");
    });

    socket.on('send message', (data) => {
        if (!users.get(socket) || users.get(socket) === data.name) {
            if (!users.get(socket)) {
                const name = data.name;
                let nameIsExists = false;
                for (let param of users) {
                    if (param[1] === data.name) {
                        nameIsExists = true;
                        break;
                    }
                }
                if (nameIsExists) {
                    socket.emit('change name', {});
                } else {
                    users.set(socket, data.name);
                    io.sockets.emit('add message', {msg: data.message, name: data.name, msgColor: data.msgColor});
                }
            } else {
                io.sockets.emit('add message', {msg: data.message, name: data.name, msgColor: data.msgColor});
            }
        } else {
            socket.emit('change name', {});
        }
    });
});