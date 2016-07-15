/**
 *
 *
 * Problem - code repeated in several places to make changes to a record based
 * on incoming email (update assignment group, assignee, watch list)
 *
 * Solution - create a script include for ease of maintenance and uniformity, call from multiple locations.
 *
 * script include
 * SysId_Return
 *
 */

/*
 * @summary
 * given a string, command, table and table_field,
 * find the sys_id of the record that matches
 * parsing is from " to "
 *
 * @author Thomas G Bates
 * @date June 2016
 *
 * 
 *
 * Example of how to call it in an Inbound Email Action:
 * ...
 * gs.include('SysId_Return');
 *
 * // script include
 * var sir = new global.SysId_Return();
 *
 * ... // determine what type of email has been received
 *
 * var command = 'ACTION:GROUP=';
 * var table = 'sys_user_group';
 * var table_field = 'name';
 * current.assignment_group = sir.returnSysID(newSubject, command, table, table_field);
 * gs.log('Assignment group is now ' + current.assignment_group.getDisplayValue());
 * current.assigned_to = '';
 * current.work_notes = "This incident's Assignment Group has been updated via the email action by " + email.origemail;

 *
*/

var SysId_Return = Class.create();
SysId_Return.prototype = {
	initialize: function() {
	},

	returnSysID: function parseString(subject,cmd,table,table_field){

		var index1 = subject.indexOf(cmd);
		var index2 = cmd.length;
		var indexStart = index1 + index2;

		//add one for the first quote in the command
		indexStart++;

		//get the ending point for the string which should be the next space
		var indexEnd = subject.indexOf("\"", indexStart);

		//get the string to search for
		var name = subject.substring(indexStart, indexEnd);

		//search the table for the string
		var gr = new GlideRecord(table);
		gr.addQuery(table_field, name);
		gr.query();
		while(gr.next()){
			return gr.sys_id;
		}
	}
}
