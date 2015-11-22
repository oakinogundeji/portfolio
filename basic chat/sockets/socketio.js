'use strict';
/**
* Socket io module for Telios test app
*/
//==============================================================================
/**
* Module dependencies
*/
var
  io = require('socket.io')(),
  chatMsgModel = require('../models/chatModel'),
  utilities = require('../models/utilities');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Module variables
*/
var
  usernames = {},
  chatRooms = ['default'],
  serverMsg,
  errHandler = utilities.errHandler,
  cr8NewMsg = utilities.cr8NewMsg;

//------------------------------------------------------------------------------
//==============================================================================
/**
* Module utility functions
*/
function setUniqueUserName(name, socket, store) {
  if(!(name in store)){
    socket.username = name;
    store[name] = socket;
    return 'Yes';
  }
  return false;
}

function setUserName(name, socket, store) {
  socket.username = name;
  store[name] = socket;
  return 'Yes';
}
//------------------------------------------------------------------------------
//==============================================================================
/**
* Configuration and settings
*/
io.on('connection', function (socket) {
  console.log('A client has connected');

  socket.on('set_name', function (data) {
    var
      name = data,
      response,
      status = setUniqueUserName(name, socket, usernames);

    if(status == 'Yes') {
      console.log('Connected client has chosen: ', name);
      console.log(Object.keys(usernames));
      socket.room = 'default';
      socket.join('default');
      socket.emit('name_set', null);

      var members = JSON.stringify(Object.keys(usernames));
      io.sockets.in('default').emit('update_members', members);//update members of default room
      //console.log(members);
      serverMsg = JSON.stringify({
        sender: 'Chat2 Server',
        msg: socket.username + ' has joined the room'});
      io.sockets.in('default').emit('server_msg', serverMsg);//send msg to default room

      var query = chatMsgModel.find({}).sort('-createdOn').limit(15)
      .exec(function (err, msgs) {
        if(err) {
          return errHandler(err);
        }
        return socket.emit('old_msgs', msgs);
      });
    }
    else {
      response = JSON.stringify({
        sender: 'Chat2 Server',
        msg: 'Name taken, please choose another one!'});
      return socket.emit('name_set_failed', response);
    }
  });

  socket.on('chat_msg', function (data) {
    var
      data2 = JSON.parse(data),
      chat = data2.msg,
      trimChat = chat.trim(),
      msgArray = trimChat.split(' '),
      msgArrLength = msgArray.length,
      msgPrefix = msgArray[0];

    console.log(msgPrefix);

    if(chatRooms.indexOf(msgPrefix) != -1) {
      console.log('Msg for: ', chatRooms[chatRooms.indexOf(msgPrefix)]);
      console.log(data);
      //return console.log('Contents of private rooms: ', chatRooms);
      return io.sockets.in(msgPrefix).emit('chat_msg', data);
    }
    else {
      cr8NewMsg(data2);
      //console.log(data);
      return io.sockets.in('default').emit('chat_msg', data);
    }
  });

  socket.on('req_private_chat', function (data) {
    var
      data1 = JSON.parse(data),
      sender = data1.sender,
      target = data1.target,
      msg = 'Invitation to private chat',
      data2 = {sender: sender, msg: msg},
      privMsg = JSON.stringify(data2);
    console.log(privMsg);

    return usernames[target].emit('req_private_chat', privMsg);
  });

  socket.on('private_chat_accepted', function (data) {
    var
      content = JSON.parse(data),
      sender = content.sender,
      accepter = content.accepter,
      private_room_name = 'pchat' + sender + ':' + accepter,
      msg2 = {proomName: private_room_name, sender: sender, accepter: accepter},
      data2 = JSON.stringify(msg2);
    chatRooms.push(private_room_name);
    console.log(chatRooms);
    usernames[sender].join(private_room_name);
    usernames[accepter].join(private_room_name);
    usernames[sender].room = private_room_name;
    usernames[accepter].room = private_room_name;
    console.log('Rooms sender is subscribed to:', usernames[sender].room);
    console.log('Rooms accepter is subscribed to:', usernames[accepter].room);
    //console.log('Rooms sender is subscribed to:', io.sockets.manager.roomClients[usernames[sender].id]);
    //console.log('Rooms accepter is subscribed to:', io.sockets.manager.roomClients[usernames[accepter].id]);
    return io.sockets.in(private_room_name).emit('private_chat_enabled', data2);
  });

  socket.on('private_chat_refused', function (data) {
    var
      content = JSON.parse(data),
      sender = content.sender,
      rejecter = content.rejecter,
      reply = {sender: 'Chat2 Server',
        msg: rejecter + ' has refused your invitation to  chat!'};
    serverMsg = JSON.stringify(reply);
    usernames[sender].emit('server_msg', serverMsg);
    return socket.emit('private_chat_refused', serverMsg);
  });

  socket.on('disconnect', function () {
    if(socket.username in usernames) {
      delete usernames[socket.username];
      console.log(socket.username + ' has disconnected');
      if(chatRooms.indexOf(socket.room) != 0) {
        socket.leave(socket.room);
        chatRooms.splice(chatRooms.indexOf(socket.room), 1);
        console.log(chatRooms);
      }
      serverMsg = JSON.stringify({
        sender: 'Chat2 Server',
        msg: socket.username + ' has left the room'});
      io.sockets.in('default').emit('server_msg', serverMsg);
      var members = JSON.stringify(Object.keys(usernames));
      io.sockets.in('default').emit('update_members', members);
      return console.log(Object.keys(usernames));
    }
    else {
      return console.log('The anonymous client has disconnected');
    }
  });
});
//------------------------------------------------------------------------------
//==============================================================================
/**
* Export module
*/
module.exports = io;
//------------------------------------------------------------------------------
