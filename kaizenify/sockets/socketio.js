'use strict';
/**
* Socket io module for Kaizenify app
*/
//==============================================================================
/**
* Module dependencies
*/
var
  io = require('socket.io')(),
  chatMsgModel = require('../models/chatModel'),
  chatUtilities = require('../models/chatUtilities');
//------------------------------------------------------------------------------
//==============================================================================
/**
* Module variables
*/
var
  usernames = {},
  chatRooms = ['kaizenify'],
  chatRoomMembers = {
    'kaizenify': []
  },
  privateRooms = [],
  serverMsg,
  errHandler = chatUtilities.errHandler,
  cr8NewMsg = chatUtilities.cr8NewMsg;

//------------------------------------------------------------------------------
//==============================================================================
/**
* Module utility functions
*/
//following is needed for when a prompt is used to set username
/*function setUniqueUserName(name, socket, store) {
  if(!(name in store)){
    socket.username = name;
    store[name] = socket;
    return 'Yes';
  }
  return false;
}*/
//Following is needed for when i use passport to set the username
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

  socket.emit('set_name');

  socket.on('set_name', function (data) {
    var
      name = data,
      response,
      status = setUserName(name, socket, usernames);

    if(status == 'Yes') {
      console.log('Connected client has chosen: ', name);
      socket.room = ['kaizenify'];//for private chatting purposes
      //we simply push a new private channel into the room array


      //chatRooms['kaizenify'].push(name);
      socket.emit('available rooms', chatRooms);
      socket.join('kaizenify');
      chatRoomMembers['kaizenify'].push(name);
      console.log('chatRoomMembers of kaizenofy are', chatRoomMembers['kaizenify']);
      socket.emit('joined_room', 'kaizenify');

      var
        //members = Object.keys(usernames),
        members = chatRoomMembers['kaizenify'],
        memberInfo = JSON.stringify({room: 'kaizenify', members: members});
      console.log('The members of kaizenify are', members);
      console.log(Object.prototype.toString.call(members));
      io.sockets.in('kaizenify').emit('update_members', memberInfo);//update members of default room
      //console.log(members);
      serverMsg = JSON.stringify({
        sender: 'Kaizenify Server',
        msg: socket.username + ' has joined the room'});
      io.sockets.in('kaizenify').emit('server_msg', serverMsg);//send msg to default room

      var query = chatMsgModel.find({}).sort('-createdOn').limit(15)
      .exec(function (err, msgs) {
        if(err) {
          return errHandler(err);
        }
        console.log('old msgs are - ',msgs);
        return socket.emit('old_msgs', msgs);
      });
    }
    return null;
  });

  socket.on('chat_msg', function (data) {
    var
      data2 = JSON.parse(data),
      chat = data2.msg,
      trimChat = chat.trim(),
      msgArray = trimChat.split(' '),
      msgPrefix = msgArray[0];

    console.log(data2);
    console.log(chat);
    console.log(msgPrefix);

    if(privateRooms.indexOf(msgPrefix) != -1) {
      console.log('Msg for: ', privateRooms[msgPrefix]);
      console.log(data);
      //return console.log('Contents of private rooms: ', chatRooms);
      return io.sockets.in(msgPrefix).emit('chat_msg', data);
    }
    else {
      cr8NewMsg(data2);
      console.log(data);
      return io.sockets.in('kaizenify').emit('chat_msg', data);
    }
  });

  socket.on('newRoomcreated', function (data) {
    console.log('present rooms', chatRooms);
    console.log('the new room is',data);
    chatRooms.push(data);
    console.log('available rooms', chatRooms);
    socket.emit('new rooms', data);
    return null;
  });

  socket.on('join room', function (room) {
    console.log('request to join room', room);
    socket.room.push(room);
    socket.join(room);
    if((room in chatRoomMembers) == false) {//cr8 a new entry for the room if room empty
      chatRoomMembers[room] = [];
    }
    chatRoomMembers[room].push(socket.username);//add user to the room
    serverMsg = JSON.stringify({
      sender: 'Kaizenify Server',
      msg: socket.username + ' has joined ' + room});
    io.sockets.in(room).emit('server_msg', serverMsg);
    var
      members = chatRoomMembers[room],
      memberInfo = JSON.stringify({room: room, members: members});
    io.sockets.in(room).emit('update_members', memberInfo);
    socket.emit('joined_room', room);
    return null;
  });

  socket.on('req_private_chat', function (data) {
    var
      data1 = JSON.parse(data),
      sender = data1.sender,
      target = data1.target,
      msg = 'Invitation to private chat',
      data2 = {sender: sender, msg: msg},
      privMsg = JSON.stringify(data2);
    /*console.log('raw pchat request data', data);
    console.log('parsed pchat request data',data1);

    console.log(privMsg);
    console.log(usernames[target]);*/
    console.log('target is',data1.target);

    return usernames[target].emit('req_private_chat', privMsg);
  });

  socket.on('private_chat_accepted', function (data) {
    console.log(data);
    var
      content = JSON.parse(data),
      sender = content.sender,
      accepter = content.accepter,
      private_room_name = 'pchat-' + sender + ':' + accepter,
      msg2 = {proomName: private_room_name, sender: sender, accepter: accepter},
      data2 = JSON.stringify(msg2);
    if(privateRooms.indexOf(private_room_name) != -1) {
      return null;
    }
    else {
      privateRooms.push(private_room_name);
    }
    console.log(privateRooms);
    usernames[sender].proom = [];
    usernames[accepter].proom = [];
    usernames[sender].join(private_room_name);
    usernames[accepter].join(private_room_name);
    usernames[sender].proom.push(private_room_name);
    usernames[accepter].proom.push(private_room_name);
    console.log('Private Rooms sender ' + sender +
    ' is subscribed to:', usernames[sender].proom);
    console.log('Private Rooms accepter ' + accepter +
    ' is subscribed to:', usernames[accepter].proom);
    //console.log('Rooms sender is subscribed to:', io.sockets.manager.roomClients[usernames[sender].id]);
    //console.log('Rooms accepter is subscribed to:', io.sockets.manager.roomClients[usernames[accepter].id]);
    return io.sockets.in(private_room_name).emit('private_chat_enabled', data2);
  });

  socket.on('private_chat_refused', function (data) {
    var
      content = JSON.parse(data),
      sender = content.sender,
      rejecter = content.rejecter,
      reply = {sender: 'Kaizenify Server',
        msg: rejecter + ' has refused your invitation to  chat!'};
    serverMsg = JSON.stringify(reply);
    usernames[sender].emit('server_msg', serverMsg);
    return socket.emit('private_chat_refused', serverMsg);
  });

  socket.on('disconnect', function () {
    if(socket.username in usernames) {
      console.log('b4 delete',usernames);
      delete usernames[socket.username];
      console.log('after delete', usernames);
      console.log(socket.username + ' has disconnected');

      if(privateRooms.indexOf(socket.proom) != -1) {
        socket.leave(socket.proom);
        privateRooms.splice(privateRooms.indexOf(socket.proom), 1);
        console.log(privateRooms);
      }

      serverMsg = JSON.stringify({
        sender: 'Kaizenify Server',
        msg: socket.username + ' has left the room'});
      io.sockets.in('kaizenify').emit('server_msg', serverMsg);
      var
        members = Object.keys(usernames),
        memberInfo = JSON.stringify({room: 'kaizenify', members: members});
      io.sockets.in('kaizenify').emit('update_members', memberInfo);
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
