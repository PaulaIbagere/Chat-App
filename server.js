const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');
const botName = 'ChatCord Bot';

const app = express();
//to create a server
const server = http.createServer(app);
const io = socketio(server);
//for static files
app.use(express.static(path.join(__dirname , 'public')));

//to run when a client connects 
io.on('connection', socket =>{
  socket.on('joinRoom',({username, room}) =>{
    const user = userJoin(socket.id, username, room)
    socket.join(user.room);
    //to emit events back and forth. this will emit to the single client that is connecting
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));
    //broadcast when a user connects this will emit to everyone except the user that is connecting to a specific room
    socket.broadcast.to(user.room).emit(
      "message",
      formatMessage(botName, `${user.username} has joined the chat`)
    );

    //send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })
  });
  
    //   io.emit(); //to broadcast to everyone, which is the basic way to send a message

    //listen to chat message
    socket.on('chatMessage', msg=>{
      const user = getCurrentUser(socket.id);
      io.to(user.room).emit("message", formatMessage(user.username, msg)); //emit the message to everyone
    });

        //runs when client disconnects
    socket.on('disconnect', ()=>{
      const user = userLeave(socket.id);
      if(user){
        //inform everyone that a user has left the chat
        io.to(user.room).emit("message", formatMessage(botName,`${user.username} has left the chat`));

        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    })
      }
       
    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on Port ${PORT}`))