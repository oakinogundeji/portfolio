//Declaration of global variables
var
  validNumber = false,
  reply,
  testNumber,
  output,
  msg;


//function to test primality
function primeNumTest () {

  while (validNumber === false) {
    testNumber = prompt('Enter any number from 2 upwards to test if it is a prime number');
    if ((isNaN(testNumber)) || (testNumber < 2)) {
    alert('please input a valid number greater than 2');
    }
    else {
      validNumber = true;
    }
  }

  var
    number = Number(testNumber),
    candidate,
    tempMsg,
    counter = 0,
    test1,//test for 1st condition for prime number
    test2,//test for 2nd condition for prime number
    i;

//Following code determines if input is a prime number
  for (i = 1; (counter < number); i++) {
    test1 = (i * 6) - 1;//this is first primality test
    test2 = (i * 6) + 1;//this is second primality test
    counter = test1;//this is counter to ensure loop doesn't exceed value of number
    if (test1 == number) {//if test1 passes
      candidate = test1;
      tempMsg = sqrRtChecker(candidate);
      if(tempMsg == 'no') {
        msg = tempMsg;
        return msg;
      }
      msg = 'yes';
      return msg;
    }
    else if (test2 == number) {//if test2 passes
      candidate = test2;
      tempMsg = sqrRtChecker(candidate);
      if(tempMsg == 'no') {
        msg = tempMsg;
        return msg;
      }
      msg = 'yes';
      return msg;
    }
  }

//following code screens for 2 and 3
  if ((number == 2) || (number == 3)) {
    msg = 'yes';
    return msg;
  }
}

//Check that the squareroot of the number is not prime e.g. 25
function sqrRtChecker(num) {
  var
    sqrt = Math.ceil(Math.sqrt(num)),
    counter = 0,
    test1,//test for 1st condition for prime number
    test2,//test for 2nd condition for prime number
    i;

//Following code determines if input is a prime number
  for (i = 1; (counter < sqrt); i++) {
    test1 = (i * 6) - 1;//this is first primality test
    test2 = (i * 6) + 1;//this is second primality test
    counter = test1;//this is counter to ensure loop doesn't exceed value of number
    if (test1 == sqrt) {//if test1 passes
      return 'no';
    }
    else if (test2 == sqrt) {//if test2 passes
      return 'no';
    }
  }
}

 //function to yield result
function result () {
  primeNumTest();
  if (msg == 'yes') {
    reply = testNumber + ' is a prime number';
    return reply;
  }
  else {
    reply = testNumber + ' is not a prime number';
    return reply;
  }
}


//function to run everything
function theTest (fn) {
  fn();
  output = alert(reply);
}

theTest(result);

//this test needs one more function to confirm that the
//sqrt of the number is not prime e.g. 25
