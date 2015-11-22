//Define Global state
var
  appState = {
    titleSet: false,
    userdata: window.userdata,
    //displayMsgs: []//used to display initial messages from server
    //oldMsgs: [],
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
        console.log(this.roommembers);
        var that = this.roommembers;
        var unik = this.roommembers.filter(function (elem, index,that) {
          return index == that.indexOf(elem);
        });
        console.log(unik);
        return unik;
      }
    },
    methods: {
      onSend: function () {
        if(this.chatMsg.trim()) {
          console.log('Submit event occurred');
          console.log(this.chatMsg);
          var
            msg,
            sender,
            chatmsg1,
            chatmsg;

          msg = this.chatMsg;
          sender = this.chatUserName;
          chatmsg1 = {sender: sender, msg: msg};
          chatmsg = JSON.stringify(chatmsg1);
          console.log(chatmsg);
          socket.emit('chat_msg', chatmsg);
          this.chatMsg = '';
          return null;
        }
        return null;
      },
      cr8Room: function () {
        console.log('cr8 new room button clicked');
        this.cr8RoomReq = true;
        return null;
      },
      addRoom: function () {
        console.log('A room will be added');
        if(this.newRoom.trim()) {
          var room = this.newRoom;
          console.log('new room is',this.newRoom);
          //this.chatRooms.push(this.newRoom);
          //console.log('contents of chatrooms array',this.chatRooms);
          socket.emit('newRoomcreated', room);
          this.newRoom = '';
          this.cr8RoomReq = false;
          return null;
        }
        return null;
      },
      joinRoom: function (room) {
        console.log('request to join room', room);
        socket.emit('join room', room);
        return null;
      },
      showMembers: function (room) {
        console.log('showMembers button clicked');
        console.log('room is ', room);
        console.log(appState.chatRooms[room]);
        console.log('number of members is', appState.chatRooms[room].length);
        console.log(this.roommembers);
        this.roommembers = appState.chatRooms[room];
        this.room = room;
        //this.roomMembers = appState.chatRooms[room];
        //console.log('showMembers of ' + room + ' are ' + this.chatRooms[room]);
        return true;
      },
      initPrivateChat: function (person) {
        if(person == appState.userdata.localemail ||
          appState.userdata.fbDisplayName ||
          appState.userdata.twitterDisplayName) {
          return null;
        }
        else {
          console.log('private chat target is',person);
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
      //this.chatRoomsDisplayMsgs = this.chatRoomsOldMsgs = [];
      console.log('on ready, displayMsgs', this.chatRoomsDisplayMsgs);

      console.log('emitting setname');
      socket.emit('set_name', self.chatUserName);

      socket.on('set_name', function () {
        return socket.emit('set_name', self.chatUserName);
      });

      socket.on('available rooms', function (data) {
        console.log('initial rooms', self.chatRooms);
        console.log('initial appstate rooms', appState.chatRooms);
        console.log('available rooms are', data);
        self.chatRooms = data;
        //console.log('chatrooms obj from server is an', Object.prototype.toString.call(data));
        data.forEach(function (room) {
          appState.chatRooms[room] = [];
        }) ;
        console.log('present rooms', self.chatRooms);
        console.log('present appstate rooms', appState.chatRooms);
        return null;
      });

      socket.on('new rooms', function (data) {
        console.log('new room from new rooms event',data);
        console.log('from new rooms, present app chatrooms', appState.chatRooms);
        appState.chatRooms[data] = [];
        console.log('from new rooms updataed app chatrooms', appState.chatRooms);
        self.chatRooms.push(data);
        return null;
      });

      socket.on('joined_room', function (room) {
        console.log('joined room', room);
        return null;
      });

      socket.on('update_members', function (data) {
        var
          msg = JSON.parse(data),
          room = msg.room,
          list = msg.members,
          member;
        /*console.log('update members list',list);
        console.log('update members for room',room);
        console.log('chatroom members for ' + room +' : ' + appState.chatRooms[room]);*/
        if(room in appState.chatRooms) {
          //self.chatRooms[room] = [];
          console.log(Object.prototype.toString.call(list));
          list.forEach(function (name) {
            appState.chatRooms[room].push(name);
          });
          console.log('chatroom members for ' + room +' : ' + appState.chatRooms[room]);
          return null;
        }
        return null;
      });

      socket.on('server_msg', function (data) {
        console.log('receiving server msg', data);
        var
          content = JSON.parse(data),
          msg1 = content.msg,
          sender = content.sender,
          msg = '<p class="serverMsg">' + sender +': ' + msg1 + '</p>';
        console.log(msg);
        self.chatRoomsDisplayMsgs.unshift(msg);
        console.log('on server msg, displayMsgs', self.chatRoomsDisplayMsgs);
        return null;
      });


      console.log('old msgs from ready hook',this.chatRoomsOldMsgs);
      socket.on('old_msgs', function (data) {
        console.log('receiving old msgs', data);
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
        console.log('old msgs after receipt',self.chatRoomsOldMsgs);
        display = self.chatRoomsOldMsgs.concat(self.chatRoomsDisplayMsgs);
        console.log('display is ',display);
        self.chatRoomsDisplayMsgs = display;
        //self.chatRoomsDisplayMsgs.concat(self.chatRoomsOldMsgs);
        console.log('concat msgs',self.chatRoomsDisplayMsgs);
        return null;
      });

      socket.on('chat_msg', function (data) {
        console.log('receiving chat msgs', data);
        var
          content = JSON.parse(data),
          msg = content.msg,
          sender = content.sender,
          chatmsg = '<p class="chatMsg">' + sender + ': ' + msg + '</p>';
        console.log(chatmsg);
        self.chatRoomsDisplayMsgs.unshift(chatmsg);
        console.log('new contents of display msgs',self.chatRoomsDisplayMsgs);
        //return $display.prepend(chatMsg);
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
          console.log('pchat accepted', response);
          return socket.emit('private_chat_accepted', response);
        }
        else {
            data2 = {sender: sender, rejecter: self.chatUserName},
            response = JSON.stringify(data2);
            console.log('pchat rejected', response);
          return socket.emit('private_chat_refused', response);
        }
        //return console.log(data);
      });

      socket.on('private_chat_enabled', function (data) {
        console.log('initial pchat keys', self.pChatKeys);
        var
          reply = JSON.parse(data),
          roomKey = reply.proomName,
          friend = reply.sender;
        console.log('pchat nabled parsed respionse', reply);
        console.log('pchat key', roomKey);
        console.log('pchat friend', friend);
        instructions = '<div id="instructionsDiv"><p class="chatInstructions">To send a private chat';
        instructions += ' to your friend, prefix the message with the roomKey';
        instructions += ' <b>' + roomKey + '</b>. The private chat will not be stored in the dBase.';
        instructions +=  'Example: "' + roomKey + ' Chat rockzx!!!"</p><br>';
        instructions += '<button id="pChattoggle" class="border">toggle</button></div>';
        self.pChatInstructions = instructions;
        console.log(self.pChatInstructions);
        self.pChatKeys.push(roomKey);
        console.log('updated pchat keys', self.pChatKeys);
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
        console.log('Show Info was cicked on ' + acct );
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
    },
    events: {

    }
  }),

// Create a router instance.
  router = new VueRouter();

// Define some routes.
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// Vue.extend(), or just a component options object.
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
