answer();

function answer(){
    var job = gs.getUser().getRecord().getValue('u_job_family');
    if (job == "Human Resources"){return true;}
    else{return false;}


    scriptTest();
function scriptTest() {
  var retVal;
  if (gs.getUser().getRecord().getDisplayValue('department') == 'Product Management') {
      retVal = true;
  } else {
      retVal = false;
  }
  return retVal;
}

gs.getUser().getRecord().getValue('active') === true




    testActiveUser();
function testActiveUser() {
  var isUserActive = false;
  if (gs.getUser().getRecord().getValue('active') === true) {
      isUserActive = true;
  }
  return isUserActive;
}
