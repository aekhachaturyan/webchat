const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(3000, '127.0.0.1', () => {
    console.log("Server running at http://127.0.0.1:3000");
});

app.use('/assets', express.static('assets'));
app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
});

let users = new Map(); // socket : username

io.sockets.on('connection', (socket) => {
    console.log('Connected');

    socket.on('disconnect', (data) => {
        console.log("Disconnected" + (users.get(socket) ? ' ' + users.get(socket) : ""));
        users.delete(socket);
    });

    socket.on('send message', (data) => {
        const name = data.name;
        if (!users.get(socket) || users.get(socket) === name) {
            if (!users.get(socket)) {
                let nameIsExists = false;
                for (let user of users) {
                    let username = user[1];
                    if (username === name) {
                        nameIsExists = true;
                        break;
                    }
                }
                if (nameIsExists) {
                    socket.emit('change name', {});
                } else {
                    users.set(socket, data.name);
                    io.sockets.emit('add message', {msg: data.message, name: data.name, msgStyle: data.msgStyle});
                }
            } else {
                io.sockets.emit('add message', {msg: data.message, name: data.name, msgStyle: data.msgStyle});
            }
        } else {
            socket.emit('change name', {});
        }
    });
});