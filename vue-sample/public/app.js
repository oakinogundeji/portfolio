//Define Vue-Resource global config
Vue.http.options.root = '/root';
Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';

// Define some components
var
  Contact = Vue.extend({
    template: '#app-content-contact-tmpl8',
    computed: {
      greetings: function () {
        var
          location = this.$route.path,
          frag = location.split('/')[1];
          //page = frag.substring(0, frag.indexOf('?'));
        /*console.log(location);
        console.log(frag);
        console.log(page);*/
        return 'Welcome to the ' + frag + ' page';
      }
    }
  }),

  Msg = Vue.extend({
    template: '#app-content-contact-msg-tmpl8',
    data: function () {
      return {
        name: '',
        message: '',
        data: ''
      };
    },
    computed: {
      isValid: function () {
        if(this.name.trim() && this.message.trim()) {
          return null;
        }
        return 'disabled';
      }
    },
    methods: {
      deliverMsg: function () {
        if(this.name.trim() && this.message.trim()) {
          this.valid = true;
          var data = {
            sender: this.name,
            msg: this.message
          }
          this.data = data;
          this.name = this.message = '';
          return null;
        }
        return null;
      }
    }
  }),

  Customers = Vue.extend({
    template: '#app-content-customers-tmpl8',
    computed: {
      greetings: function () {
        var
          location = this.$route.path,
          frag = location.split('/')[1];
          //page = frag.substring(0, frag.indexOf('?'));
        return 'Welcome to the ' + frag + ' page';
      }
    },
    props: ['userlist'],
    methods: {
      onClick: function (item) {
        console.log('button clicked');
        console.log(item.name);
        this.$dispatch('delItem', item);
      }
    }
  }),

// The router needs a root component to render.
// For demo purposes, we will just use an empty one
// because we are using the HTML as the app template.
  App = Vue.extend({
    data: function () {
      return {
        userlist: []
      };
    },
    template: '#app-tmpl8',
    components: {
      'app-nav': {
        template: '#app-nav-tmpl8',
      }
    },
    events: {
      'delItem': function (item) {
        console.log('from Base App ', item.name);
        var listItem = this.userlist[this.userlist.indexOf(item)];
        console.log('Does item exist? ,', listItem.name == item.name);
        this.userlist.$remove(listItem);
      }
    },
    ready: function () {
      console.log('initial state of userlist ', this.userlist);
      //get list of users
      this.$http.get('/api/users', function (data, status, req) {
        console.log(data);
        this.userlist = data;
        console.log('final state of userlist ', this.userlist);
      }).error(function (data, status, req) {
        console.log(status);
      });
    }
  }),

// Create a router instance.
// You can pass in additional options here, but let's
// keep it simple for now.
  router = new VueRouter();

// Define some routes.
// Each route should map to a component.
router.map({
  '/customers': {
    name: 'customers',
    component: Customers
  },
  '/contact': {
    name: 'contact-us',
    component: Contact,
    subRoutes: {
      '/msg': {
        name: 'msg',
        component: Msg
      }
    }
  }
});

// Now we can start the app!
// The router will create an instance of App and mount to
// the element matching the selector #app.
router.start(App, '#app');
