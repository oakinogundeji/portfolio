/*
The following function returns an object
the object takes any array and applies a custom sort function
the result is an array sorted in ascending or descending order
*/
function custmSort() {
  var sortObj = {
    ascending: function (arr) {
      function comp(i,j) {
        if(i > j) {
          return 1;
        }
        if(i < j) {
          return -1;
        }
        else {
          return 0;
        }
      }
      return arr.sort(comp);
    },
    descending: function (arr) {
      function comp(i,j) {
        if(i > j) {
          return 1;
        }
        else if(i < j) {
          return -1;
        }
        else {
          return 0;
        }
      }
      return arr.sort(comp).reverse();
    }
  }
  return sortObj;
};
