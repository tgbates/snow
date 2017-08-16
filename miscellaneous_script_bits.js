defect
Product
release
opened for
impact
priority
short descr
descr.



isMember_SLAC

function isMember_SLAC(user, group){
    gs.log("In Script Include isMember_SLAC  " + user + " " + group);
	var su = new GlideRecord('sys_user');
	su.addQuery('sys_id', user);
	su.query();
	if (su.next()) {
		gs.log("Found: " + su.name);
		return su.isMemberOf(gr.getValue('group'));
	}
}

answer =
(current.opened_by === gs.getUserID() ||
current.u_requestor === gs.getUserID() ||
current.work_notes_list.indexOf(gs.getUserID()) > -1 ||
gs.getUser().isMemberOf(current.assignment_group));



Allow write for all fields in rm_story, for users with roles (scrum_admin, scrum_story_creator),
if one of the following is true (from script): user matches opened by, opened for, is on the work notes list, or is a member of the current assignment group.

// https://community.servicenow.com/message/772441#772441
answer =
(current.opened_by === gs.getUserID() ||
current.u_opened_for === gs.getUserID() ||
current.work_notes_list.indexOf(gs.getUserID()) > -1 ||
gs.getUser().isMemberOf(current.assignment_group));



// https://community.servicenow.com/message/772441#772441
//  user matches:
//  opened by,
//  opened for,
//  is on the work notes list,
//  or is a member of the current assignment group.

var answer = false;

if (current.opened_by === gs.getUserID() ||
current.u_opened_for === gs.getUserID() ||
current.work_notes_list.indexOf(gs.getUserID()) > -1 ||
gs.getUser().isMemberOf(current.assignment_group) ||
current.assignment_group === '') {

  answer = true;
}

var ProductOwnerReturn_SLAC = Class.create();
ProductOwnerReturn_SLAC.prototype = Object.extendsObject(AbstractAjaxProcessor, {
		returnOwner: function() {
		var prod = this.getParameter('sysparm_product');
		var capm = new GlideRecord('cmdb_application_product_model');

 		capm.addQuery('sys_id', prod);
 		capm.query();
 		if (capm.next()) {
 			var owner = capm.owner;
 			return owner;
 		}
	},



  var isMember_SLAC = Class.create();
  isMember_SLAC.prototype = Object.extendsObject(AbstractAjaxProcessor, {
  		isMember: function() {
  //function isMember_SLAC(group){
  			var ag = this.getParameter('sysparm_group');
  			var su = this.getParameter('sysparm_user');
  //	var su = gs.getUser();
      gs.log("In Script Include isMember_SLAC  " + su + " " + ag);
  	//var su = new GlideRecord('sys_user');
  	//su.addQuery('sys_id', user);
  	//su.query();
  	//if (su.next()) {
  		gs.log("Found: " + su.name);
  		return su.isMemberOf(gr.getValue('ag'));
  	}
  });

  var isMember_SLAC = Class.create();
  isMember_SLAC.prototype = {
  	initialize: function() {

  	},

  	isMember: function checkUserGroup(user, group) {
  		gs.log("In Script Include isMember_SLAC  " + user + " " + group);
  		var gr = new GlideRecord('sys_user_grmember');
  		gr.addQuery('group', group);
  		gr.addQuery('user', user);
  		gr.query();
  		if (gr.next()) {
  			return true; //user.isMemberOf(gr.getValue('group'));
  		}
  		else {
  			return false;
  		}
  	}
  };


  * Example of how to call it in an Inbound Email Action:
  * ...
  * gs.include('isMember_SLAC');
  *
  * // script include
  * var ims = new global.isMember_SLAC();
  *
  * var command = 'ACTION:GROUP=';
  * var table = 'sys_user_group';
  * var table_field = 'name';
  * var result = ims.checkUserGroup(user, group);
  * gs.log('Assignment group is now ' + current.assignment_group.getDisplayValue());
  * current.assigned_to = '';
  * current.work_notes = "This incident's Assignment Group has been updated via the email action by " + email.origemail;




  function returnCurrentUserGroup(){
    var myUserObject = gs.getUser();
    var myUserGroups = myUserObject.getMyGroups();
    var groupsArray = new Array();
    var it = myUserGroups.iterator();
    var i=0;
    while(it.hasNext()){
        var myGroup = it.next();
        groupsArray[i]=myGroup;
        i++;
    }
    return groupsArray;
}

var test = returnCurrentUserGroup();
gs.print(test[0]);





// Initialize answer to false, set true if it is a draft, there is no assignment group, or group matches mine

var answer = false;


if (current.state == -6) {  // Draft
	answer = true;
}

else if (current.assignment_group == '') {	// No assignment group
	answer = true;
}
else if (gs.getUser().isMemberOf(current.assignment_group)) {  // My assignment group
  answer = true;
}



