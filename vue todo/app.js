//Create the VM
var todoApp = new Vue({
//define the DOM View element
  el: '#todo',
//define the Data Model
  data: {
    todoItem: '',
    remaining: [],
    completed: [],
    listName: '',
    displayList: null
  },
//define Computed properties
  computed: {
    showListName: function () {
      if(this.all.length) {
        return true;
      }
      return false;
    },
    all: function () {
      return this.remaining.concat(this.completed);
    },
    remainingItems: function () {
      return this.remaining.length;
    },
    completedItems: function () {
      return this.completed.length;
    },
    allItems: function () {
      return this.all.length;
    }
  },
//define View methods
  methods: {
    addTodo: function () {
      this.remaining.push(this.todoItem);
      this.listName = 'Remaining';
      this.displayList = this.remaining;
      return this.todoItem = '';
    },
    markComplete : function (item, e) {
      var index = this.remaining.indexOf(item);
      if(e.target.checked === true) {
        this.completed.push(item);
        return this.remaining.splice(index, 1);
      }
      return console.log(item +' was marked incomplete');
    },
    markAllItemsComplete: function () {
      console.log('mark all complete button clicked');
      var self = this;
      this.remaining.forEach(function (todo) {
        self.completed.push(todo);
      });
      this.remaining = [];
    },
    showRemaining: function () {
      this.listName = 'Remaining';
      this.displayList = this.remaining;
      return console.log('show remaining was clicked');
    },
    showCompleted: function () {
      this.listName = 'Completed';
      this.displayList = this.completed;
      return console.log('show completed was clicked');
    },
    showAll: function () {
      this.listName = 'All';
      this.displayList = this.all;
      return console.log('show all was clicked');
    },
    editItem: function (item, listName) {
      console.log('edit was clicked on ', item);
      if(!this.todoItem) {
        this.removeItem(item, listName);
        this.todoItem = item;
        return
      }
      return alert('You must finish editing the current item');
    },
    removeItem: function (item, listName) {
      var
        list = listName.toLowerCase(),
        index = this[list].indexOf(item);
      return this[list].splice(index, 1);
    }
  }
});
