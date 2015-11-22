//Define Global state
var
  appState = {
    titleSet: false,
    userdata: window.userdata,
    chatRooms: {}//link this to chatRooms componenmt
  },

//Setup global socket.io connection
  socket = io();
// Define some components
var
  Chatrooms = Vue.extend({
    data: function () {
      return {
        chatMsg: '',
        room: null,
        roommembers: {},
        chatRooms:[],
        chatRoomsDisplayMsgs: [],
        chatRoomsOldMsgs: [],
        pChatInstructions: null,
        pChatKeys: [],
        cr8RoomReq: false,
        newRoom: ''
      };
    },
    template: '#app-chatrooms-tmpl8',
    computed: {
      chatUserName: function () {
        if(appState.userdata.localemail) {
          return appState.userdata.localemail;
        }
        if(appState.userdata.fbDisplayName) {
          return appState.userdata.fbDisplayName;
        }
        if(appState.userdata.twitterDisplayName) {
          return appState.userdata.twitterDisplayName;
        }
      },
      isValid: function () {
        if(this.chatMsg.trim()) {
          return null;
        }
        return 'disabled';
      },
      roomMembers: function () {
        var that = this.roommembers;
        var unik = this.roommembers.filter(function (elem, index,that) {
          return index == that.indexOf(elem);
        });
        return unik;
      }
    },
    methods: {
      onSend: function () {
        if(this.chatMsg.trim()) {
          var
            msg,
            sender,
            chatmsg1,
            chatmsg;

          msg = this.chatMsg;
          sender = this.chatUserName;
          chatmsg1 = {sender: sender, msg: msg};
          chatmsg = JSON.stringify(chatmsg1);
          socket.emit('chat_msg', chatmsg);
          this.chatMsg = '';
          return null;
        }
        return null;
      },
      cr8Room: function () {
        this.cr8RoomReq = true;
        return null;
      },
      addRoom: function () {
        if(this.newRoom.trim()) {
          var room = this.newRoom;
          socket.emit('newRoomcreated', room);
          this.newRoom = '';
          this.cr8RoomReq = false;
          return null;
        }
        return null;
      },
      joinRoom: function (room) {
        socket.emit('join room', room);
        return null;
      },
      showMembers: function (room) {
        this.roommembers = appState.chatRooms[room];
        this.room = room;
        return true;
      },
      initPrivateChat: function (person) {
        if(person == appState.userdata.localemail ||
          appState.userdata.fbDisplayName ||
          appState.userdata.twitterDisplayName) {
          return null;
        }
        else {
          var
            target = person,
            sender = appState.userdata.localemail,
            data = {
              sender: sender,
              target: target
            },
            msg = JSON.stringify(data);
            console.log(msg);
          socket.emit('req_private_chat', msg);
          return null;
        }
      }
    },
    ready: function () {
      var self = this;

      socket.emit('set_name', self.chatUserName);

      socket.on('set_name', function () {
        return socket.emit('set_name', self.chatUserName);
      });

      socket.on('available rooms', function (data) {
        self.chatRooms = data;
        data.forEach(function (room) {
          appState.chatRooms[room] = [];
        });
        return null;
      });

      socket.on('new rooms', function (data) {
        appState.chatRooms[data] = [];
        self.chatRooms.push(data);
        return null;
      });

      socket.on('joined_room', function (room) {
        return null;
      });

      socket.on('update_members', function (data) {
        var
          msg = JSON.parse(data),
          room = msg.room,
          list = msg.members,
          member;

        if(room in appState.chatRooms) {
          list.forEach(function (name) {
            appState.chatRooms[room].push(name);
          });
          return null;
        }
        return null;
      });

      socket.on('server_msg', function (data) {
        var
          content = JSON.parse(data),
          msg1 = content.msg,
          sender = content.sender,
          msg = '<p class="serverMsg">' + sender +': ' + msg1 + '</p>';
        self.chatRoomsDisplayMsgs.unshift(msg);
        return null;
      });

      socket.on('old_msgs', function (data) {
        var
          i,
          length = data.length,
          msg,
          sender,
          chatMsg,
          display;
        for(i = 0; i < length ; i++) {
          sender = data[i].sender;
          msg = data[i].msg;
          chatMsg = '<p class="chatMsg">' + sender + ': ' + msg + '</p>';
          self.chatRoomsOldMsgs.push(chatMsg);
        }
        display = self.chatRoomsOldMsgs.concat(self.chatRoomsDisplayMsgs);
        self.chatRoomsDisplayMsgs = display;
        return null;
      });

      socket.on('chat_msg', function (data) {
        var
          content = JSON.parse(data),
          msg = content.msg,
          sender = content.sender,
          chatmsg = '<p class="chatMsg">' + sender + ': ' + msg + '</p>';
        self.chatRoomsDisplayMsgs.unshift(chatmsg);
        return null;
      });

      socket.on('req_private_chat', function (data) {
        var
          content = JSON.parse(data),
          sender = content.sender,
          msg = content.msg,
          data2,
          response,
          output = msg + ' from ' + sender + '\n' +
            'if you accept click ok, else click cancel';
          status = prompt(output);

        if(status == '') {
          data2 = {sender: sender, accepter: self.chatUserName},
          response = JSON.stringify(data2);
          return socket.emit('private_chat_accepted', response);
        }
        else {
            data2 = {sender: sender, rejecter: self.chatUserName},
            response = JSON.stringify(data2);
          return socket.emit('private_chat_refused', response);
        }
      });

      socket.on('private_chat_enabled', function (data) {
        var
          reply = JSON.parse(data),
          roomKey = reply.proomName,
          friend = reply.sender;
        instructions = '<div id="instructionsDiv"><p class="chatInstructions">To send a private chat';
        instructions += ' to your friend, prefix the message with the roomKey';
        instructions += ' <b>' + roomKey + '</b>. The private chat will not be stored in the dBase.';
        instructions +=  'Example: "' + roomKey + ' Chat rockzx!!!"</p><br>';
        instructions += '<button id="pChattoggle" class="border">toggle</button></div>';
        self.pChatInstructions = instructions;
        self.pChatKeys.push(roomKey);
        return console.log(data);
      });

    }
  }),

  Profile = Vue.extend({
    data: function () {
      return {
        email: appState.userdata.localemail || appState.userdata.fbEmail,
        fbname: appState.userdata.fbDisplayName,
        fbphoto1: appState.userdata.fbPhoto[0],
        fbphoto2: appState.userdata.fbPhoto[1],
        fbphoto3: appState.userdata.fbPhoto[2],
        twittername: appState.userdata.twitterDisplayName,
        twitterphoto: appState.userdata.twitterPhoto,
        showSmInfo: null
      };
    },
    template: '#app-profile-tmpl8',
    computed: {
      userphoto: function () {
        if(this.twitterphoto) {
          return this.twitterphoto;
        }
        return this.fbphoto1;
      },
      username: function () {
        if(this.fbname) {
          return this.fbname;
        }
        return this.twittername;
      },
      useremail: function () {
        if(this.email) {
          return this.email;
        }
        return 'No email available';
      }
    },
    methods: {
      showInfo: function (acct) {
        this.showSmInfo = acct;
        return null;
      }
    }
  }),

// The router needs a root component to render.
  App = Vue.extend({
    data: function () {
      return {
        email: appState.userdata.localemail || appState.userdata.fbEmail,
        fbname: appState.userdata.fbDisplayName,
        fbphoto: appState.userdata.fbPhoto,
        twittername: appState.userdata.twitterDisplayName,
        twitterphoto: appState.userdata.twitterPhoto
      };
    },
    template: '#app-tmpl8',
    components: {
      'app-nav': {
        template: '#app-nav-tmpl8'
      }
    }
  }),

// Create a router instance.
  router = new VueRouter();

// Define some routes.
// Each route should map to a component. 
router.map({
  '/chatrooms': {
    name: 'chatrooms',
    component: Chatrooms
  },
  '/profile': {
    name: 'profile',
    component: Profile
  }
});

// Now we can start the app!
// The router will create an instance of App and mount to
// the element matching the selector #app.
router.start(App, '#app');

//Define generic socket functionality
socket.on('connect', function () {
  //debugger;
  console.log('Connected to Kaizenify Server');
  return null;
});

socket.on('disconnect', function () {
  return console.log('Disconnected from the Kaizenify Server!');
});
